import models, schemas
from sqlalchemy.orm import Session


class ScoresRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.Scores).all()

    def get_by_event(self, id_evenement: int):
        return self.db.query(models.Scores).filter(
            models.Scores.id_evenement == id_evenement
        ).all()

    def get_by_user(self, id_utilisateur: int):
        return self.db.query(models.Scores).filter(
            models.Scores.id_utilisateur == id_utilisateur
        ).all()

    def create(self, score_data: schemas.ScoresCreate):
        new_score = models.Scores(
            id_utilisateur=score_data.id_utilisateur,
            id_evenement=score_data.id_evenement,
            position= score_data.position,
            points= score_data.points,
            resultat=score_data.resultat
        )
        self.db.add(new_score)
        self.db.commit()
        self.db.refresh(new_score)
        return new_score
    
    def update(self, id: int, score_update: schemas.ScoresUpdate):
        score = self.db.query(models.Scores).filter(
            models.Scores.id == id
        ).first()
        if score is None:
            return None

        if score_update.position is not None:
            score.position = score_update.position
        if score_update.points is not None:
            score.points = score_update.points
        if score_update.resultat is not None:
            score.resultat = score_update.resultat

        self.db.commit()
        self.db.refresh(score)
        return score
