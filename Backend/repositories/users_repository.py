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

    def update(self, id: int, user_update: schemas.UserUpdate):
        user = self.get_by_id(id)
        if user is None:
            return None
        if user_update.pseudo is not None:
            user.pseudo = user_update.pseudo
        if user_update.email is not None:
            user.email = user_update.email
        if user_update.password is not None:
            user.password = user_update.password
        if user_update.id_role is not None:
            user.id_role = user_update.id_role
        user.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, id: int):
        user = self.get_by_id(id)
        if user is None:
            return None
        self.db.delete(user)
        self.db.commit()
        return user
