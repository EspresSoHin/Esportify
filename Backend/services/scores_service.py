from sqlalchemy.orm import Session
import schemas
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from repositories.scores_repository import ScoresRepository

class ScoresService:
    def __init__(self, db: Session):
        self.repo = ScoresRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_user(self, id_utilisateur: int):
        return self.repo.get_by_user(id_utilisateur)

    def get_by_event(self, id_evenement: int):
        return self.repo.get_by_event(id_evenement)

    def create(self, score_data: schemas.ScoresCreate):
        try:
            return self.repo.create(score_data)
        except IntegrityError:
            raise HTTPException(status_code=400, detail="Données invalides — vérifie la position (doit être positive) et les identifiants.")
    
    def update(self, id: int, score_update: schemas.ScoresUpdate):
        score = self.repo.update(id, score_update)
        if score is None:
            raise HTTPException(status_code=404, detail="Score not found")
        return score
