from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from datetime import datetime, date
from Oauth2 import get_current_user, check_admin
from services.users_service import UsersService


router = APIRouter(
    prefix="/users",
    tags=["users"]    
) 


@router.get("/", response_model=list[schemas.UserPublicResponse])
def get_users(db: Session = Depends(get_db)):
    return UsersService(db).get_all()


#############################
## récupération d'un user R##
#############################


@router.get("/{id}", response_model=schemas.UserPublicResponse)
def get_user(id: int, db: Session = Depends(get_db)):
        return UsersService(db).get_by_id(id)


#############################
## modification d'un user U##
#############################

@router.put("/{id}", response_model=schemas.UserResponse)
def update_user(id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    return UsersService(db).update(id, user_update, current_user)


#############################
## suppression d'un user D##
#############################

@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    return UsersService(db).delete(id)