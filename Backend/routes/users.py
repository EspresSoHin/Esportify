from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from passlib.context import CryptContext


router = APIRouter(
    prefix="/users",
    tags=["users"]    
) 

pwd_context = CryptContext(schemes=["bcrypt"])

@router.get("/", response_model=list[schemas.UserResponse]) #fais ca quand quelqu'un fait un GET sur /users, renvoie liste de tous les utilisateurs
def get_users(db: Session = Depends(get_db)): #ca ouvre une session de base de données pour cette route
    users = db.query(models.Users).all() #traduction de "SELECT * FROM users" en SQLAlchemy
    return users


#########################
## création d'un user C##
#########################

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password[:72]) #hash le mot de passe avant de le stocker
    new_user = models.Users(
        pseudo=user.pseudo, 
        email=user.email, 
        password=hashed_password) #crée un nouvel utilisateur avec les données fournies
    db.add(new_user) #ajoute l'utilisateur à la session
    db.commit() #enregistre les changements dans la base de données
    db.refresh(new_user) #rafraîchit l'instance pour obtenir l'ID généré
    return new_user

#############################
## récupération d'un user R##
#############################


@router.get("/{id}", response_model=schemas.UserResponse)  # cette fois c'est UN seul user, pas une liste
def get_user(id: int, db: Session = Depends(get_db)):
        user = db.query(models.Users).filter(models.Users.id == id).first() #traduction de "SELECT * FROM users WHERE id = {id}" 
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user


#############################
## modification d'un user U##
#############################

@router.put("/{id}", response_model=schemas.UserResponse)
def update_user(id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.pseudo is not None:
        user.pseudo = user_update.pseudo
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.password is not None:
        user.password = pwd_context.hash(user_update.password[:72]) 

    db.commit()
    db.refresh(user)
    return user
    

#############################
## suppression d'un user D##
#############################

@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}