from sqlalchemy.orm import Session
import schemas
from fastapi import HTTPException
from repositories.favoris_repository import FavorisRepository
from sqlalchemy.exc import IntegrityError #j'ai ajouté ça

class FavorisService:
    def __init__(self, db: Session):
        self.repo = FavorisRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_user(self, id_utilisateur: int):
        return self.repo.get_by_user(id_utilisateur)

    def create(self, favoris_data: schemas.FavorisCreate):
        try:
            return self.repo.create(favoris_data)
        except IntegrityError:
            raise HTTPException(status_code=400, detail="Cet événement est déjà dans tes favoris.")

    def delete(self, id_utilisateur: int, id_evenement: int, current_user: models.Users):
        if current_user.id != id_utilisateur and current_user.id_role not in (2, 3):
            raise HTTPException(status_code=403, detail="Tu ne peux pas supprimer les favoris d'un autre utilisateur.")

        favoris = self.repo.delete(id_utilisateur, id_evenement)
        if favoris is None:
            raise HTTPException(status_code=404, detail="Favoris not found")
        
        return {"detail": "Favoris deleted successfully"}