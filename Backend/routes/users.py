from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from passlib.context import CryptContext
from datetime import datetime, date
from Oauth2 import get_current_user, check_admin


router = APIRouter(
    prefix="/users",
    tags=["users"]    
) 

pwd_context = CryptContext(schemes=["bcrypt"])

@router.get("/", response_model=list[schemas.UserPublicResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.Users).all() #traduction de "SELECT * FROM users" en SQLAlchemy
    return users

#On mets pas de POST parce que c'est un doublon avec register

#############################
## récupération d'un user R##
#############################


@router.get("/{id}", response_model=schemas.UserPublicResponse)
def get_user(id: int, db: Session = Depends(get_db), current_user: models.Users = Depends(check_admin)):
        user = db.query(models.Users).filter(models.Users.id == id).first() #traduction de "SELECT * FROM users WHERE id = {id}" 
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user


#############################
## modification d'un user U##
#############################

@router.put("/{id}", response_model=schemas.UserResponse)
def update_user(id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
 # On autorise le proprio du compte OU un admin à modifier
    if current_user.id != user.id and current_user.id_role != 2:
        raise HTTPException(status_code=403, detail="Tu ne peux modifier que ton propre profil.")

    # Le changement de rôle reste réservé à l'admin, même sur son propre compte
    if user_update.id_role is not None and current_user.id_role != 2:
        raise HTTPException(status_code=403, detail="Seul un administrateur peut modifier un rôle.")


    if user_update.pseudo is not None:
        user.pseudo = user_update.pseudo
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.password is not None:
        user.password = pwd_context.hash(user_update.password[:72]) 
    user.updated_at = datetime.now()
    if user_update.id_role is not None:
        user.id_role = user_update.id_role

    db.commit()
    db.refresh(user)
    return user
    

#############################
## suppression d'un user D##
#############################

@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}