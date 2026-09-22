from sqlalchemy.orm import Session
import schemas, models
from fastapi import HTTPException
#from sqlalchemy.exc import IntegrityError
from repositories.users_repository import UsersRepository
from passlib.context import CryptContext
#from jose import jwt #maybe
#from fastapi import Depends, status, Response, Request
#from fastapi.security import OAuth2PasswordRequestForm
#from datetime import datetime, timedelta
#from Oauth2 import create_access_token, decode_token, get_current_user


pwd_context = CryptContext(schemes=["bcrypt"])
#AuthService  logique (hash bcrypt, génération JWT, cookies)

class AuthService:
    def __init__(self, db: Session):
        self.repo = UsersRepository(db)

    def register(self, user: schemas.UserCreate):
        existing = self.repo.get_by_pseudo_or_email(user.pseudo, user.email)
        if existing:
            raise HTTPException(status_code=400, detail="Pseudo ou email déjà utilisé")

        hashed = pwd_context.hash(user.password[:72])
        self.repo.create(user.pseudo, user.email, hashed)

        return {"message": "Compte créé avec succès"}


    
   