import models, schemas
from sqlalchemy.orm import Session


class FavorisRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.Favoris).all()

    def get_by_user(self, id_utilisateur: int):
        return self.db.query(models.Favoris).filter(
            models.Favoris.id_utilisateur == id_utilisateur
        ).all()

    def create(self, favoris_data: schemas.FavorisCreate):
        new_favoris = models.Favoris(
            id_utilisateur=favoris_data.id_utilisateur,
            id_evenement=favoris_data.id_evenement
        )
        self.db.add(new_favoris)
        self.db.commit()
        self.db.refresh(new_favoris)
        return new_favoris

    def delete(self, id_utilisateur: int, id_evenement: int):
        favoris = self.db.query(models.Favoris).filter(
            models.Favoris.id_utilisateur == id_utilisateur,
            models.Favoris.id_evenement == id_evenement
        ).first()
        if favoris is None:
            return None
        self.db.delete(favoris)
        self.db.commit()
        return favoris