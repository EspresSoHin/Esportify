import models, schemas
from sqlalchemy.orm import Session
from datetime import datetime


class InscriptionsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.InscriptionsEv).all()

    def create(self, id_utilisateur: int, id_evenement: int):
        new_inscription = models.InscriptionsEv(
            id_utilisateur=id_utilisateur,
            id_evenement=id_evenement
        )
        self.db.add(new_inscription)
        self.db.commit()
        self.db.refresh(new_inscription)
        return new_inscription

    def get_inscription(self, inscription_id: int):
        return self.db.query(models.InscriptionsEv).filter(models.InscriptionsEv.id == inscription_id).first()

    def update(self, id: int, inscription_update: schemas.InscriptionUpdate):
        inscription = self.db.query(models.InscriptionsEv).filter(models.InscriptionsEv.id == id).first()
    
        if inscription is None:
            return None

        if inscription_update.id_statut_inscription is not None:
            inscription.id_statut_inscription = inscription_update.id_statut_inscription

        self.db.commit()
        self.db.refresh(inscription)
        return inscription


    def delete(self, id: int):
        inscription = self.db.query(models.InscriptionsEv).filter(models.InscriptionsEv.id == id).first()
        if inscription is None:
            return None
        self.db.delete(inscription)
        self.db.commit()
        return inscription