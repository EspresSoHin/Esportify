import models, schemas
from sqlalchemy.orm import Session


class RolesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.Roles).all()

    def get_by_role(self, id_role: int):
        return self.db.query(models.Roles).filter(
            models.Roles.id == id_role
        ).all()