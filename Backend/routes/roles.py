from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from services.roles_service import RolesService

router = APIRouter(
    prefix="/roles",
    tags=["roles"]    
) 

@router.get("/", response_model=list[schemas.RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return RolesService(db).get_all()

################################
## RECUPERATION DE ROLES R##
################################

@router.get("/{id_role}", response_model=list[schemas.RoleResponse])
def get_roles_by_id(id_role: int, db: Session = Depends(get_db)):
    return RolesService(db).get_by_role(id_role)