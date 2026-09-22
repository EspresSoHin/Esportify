from sqlalchemy.orm import Session
import schemas, models
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from repositories.inscriptions_repository import InscriptionsRepository

class InscriptionsService:
    def __init__(self, db: Session):
        self.repo = InscriptionsRepository(db)

    def get_all(self):
        return self.repo.get_all()


    def create(self, inscription: schemas.InscriptionCreate, current_user: models.Users):
        if current_user.id != inscription.id_utilisateur and current_user.id_role not in (2, 3):
            raise HTTPException(status_code=403, detail="Tu ne peux pas inscrire un autre utilisateur.")

        try:
            return self.repo.create(inscription.id_utilisateur, inscription.id_evenement)
        except IntegrityError:
            raise HTTPException(status_code=400, detail="Tu es déjà inscrit à cet événement.")


    def get_inscription(self, id_inscription: int):
        inscription = self.repo.get_inscription(id_inscription)
        if inscription is None:
            raise HTTPException(status_code=404, detail="Inscription not found")
        return inscription


    def update(self, id: int, inscription_patch: schemas.InscriptionUpdate):
        inscription = self.repo.update(id, inscription_patch)
        if inscription is None:
            raise HTTPException(status_code=404, detail="Inscription not found")
        return inscription


    def delete(self, id: int, current_user: models.Users):
        inscription = self.repo.get_inscription(id)
        if inscription is None:
            raise HTTPException(status_code=404, detail="Inscription not found")

        if current_user.id != inscription.id_utilisateur and current_user.id_role not in (2, 3):
            raise HTTPException(status_code=403, detail="Tu ne peux pas supprimer l'inscription d'un autre utilisateur.")
        
        self.repo.delete(id)
        return {"detail": "Inscription deleted successfully"}

   