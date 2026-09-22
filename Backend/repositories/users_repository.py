import models, schemas
from sqlalchemy.orm import Session
from datetime import datetime


class UsersRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.Users).all()

    def create(self, pseudo: str, email: str, hashed_password: str):
        new_user = models.Users(
            pseudo=pseudo, 
            email=email, 
            password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_by_id(self, id: int):
        return self.db.query(models.Users).filter(models.Users.id == id).first()
    
    #pour auth
    def get_by_pseudo_or_email(self, pseudo: str, email: str):
        return self.db.query(models.Users).filter(
            (models.Users.pseudo == pseudo) | (models.Users.email == email)).first()
