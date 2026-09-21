from sqlalchemy.orm import Session
import schemas
from passlib.context import CryptContext
from fastapi import HTTPException
from repositories.users_repository import UsersRepository


pwd_context = CryptContext(schemes=["bcrypt"])


class UsersService:
    def __init__(self, db: Session):
        self.repo = UsersRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def create(self, user: schemas.UserCreate):
        hashed_password = pwd_context.hash(user.password[:72]) #hash le mot de passe avant de le stocker
        return self.repo.create(user.pseudo, user.email, hashed_password)

    def get_by_id(self, id: int):
        user = self.repo.get_by_id(id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update(self, id: int, user_update: schemas.UserUpdate, current_user: models.Users):
        user = self.repo.get_by_id(id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        if current_user.id != user.id and current_user.id_role != 2:
            raise HTTPException(status_code=403, detail="Tu ne peux modifier que ton propre profil.")

        if user_update.id_role is not None and current_user.id_role != 2:
            raise HTTPException(status_code=403, detail="Seul un administrateur peut modifier un rôle.")

        if user_update.password is not None:
            user_update.password = pwd_context.hash(user_update.password[:72])  # on hash AVANT d'envoyer au repo
        
        return self.repo.update(id, user_update)


    def delete(self, id: int):
        user = self.repo.delete(id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return {"detail": "User deleted successfully"}


