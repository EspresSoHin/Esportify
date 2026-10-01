import models, schemas
from sqlalchemy.orm import Session


class StatutsEvRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.StatutsEvenement).all()