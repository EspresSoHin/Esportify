from sqlalchemy.orm import Session
from repositories.roles_repository import RolesRepository
from fastapi import HTTPException

class RolesService:
    def __init__(self, db: Session):
        self.repo = RolesRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_role(self, id_role: int):
        roles = self.repo.get_by_role(id_role)
        if not roles:
            raise HTTPException(status_code=404, detail="Roles not found")
        return roles