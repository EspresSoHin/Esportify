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

@router.get("/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.Users).all() #traduction de "SELECT * FROM users" en SQLAlchemy
    return users


#########################
## création d'un user C##
#########################

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.Users = Depends(get_current_user)):
    hashed_password = pwd_context.hash(user.password[:72]) #hash le mot de passe avant de le stocker
    new_user = models.Users(
        pseudo=user.pseudo, 
        email=user.email, 
        password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#############################
## récupération d'un user R##
#############################


@router.get("/{id}", response_model=schemas.UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
        user = db.query(models.Users).filter(models.Users.id == id).first() #traduction de "SELECT * FROM users WHERE id = {id}" 
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user


#############################
## modification d'un user U##
#############################

@router.put("/{id}", response_model=schemas.UserResponse)
def update_user(id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
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