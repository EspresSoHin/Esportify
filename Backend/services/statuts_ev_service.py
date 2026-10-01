from sqlalchemy.orm import Session
import schemas
from fastapi import HTTPException
from repositories.statuts_ev_repository import StatutsEvRepository


class StatutsEvService:
    def __init__(self, db: Session):
        self.repo = StatutsEvRepository(db)

    def get_all(self):
        return self.repo.get_all()