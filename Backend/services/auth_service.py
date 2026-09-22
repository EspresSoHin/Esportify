from sqlalchemy.orm import Session
import schemas, models
from fastapi import HTTPException, status
from repositories.users_repository import UsersRepository
from passlib.context import CryptContext
from Oauth2 import create_access_token


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

    def login(self, form_data):
        user = self.repo.get_by_pseudo_or_email(form_data.username, form_data.username)

        if not user or not pwd_context.verify(form_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiant ou mot de passe incorrect",
            )

        token = create_access_token(
            data={"sub": user.pseudo, "id": user.id, "role": user.id_role}
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "pseudo": user.pseudo,
            "id": user.id,
            "id_role": user.id_role,
        } 
