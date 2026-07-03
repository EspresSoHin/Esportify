from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas


router = APIRouter(
    prefix="/roles",
    tags=["roles"]    
) 

@router.get("/", response_model=list[schemas.RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(models.Roles).all() 
    return roles

################################
## RECUPERATION DE STATUT EV R##
################################

@router.get("/users/{id_role}", response_model=list[schemas.RoleResponse])
def get_roles_by_user(id_role: int, db: Session = Depends(get_db)):
    roles = db.query(models.Roles).filter(
        models.Roles.id == id_role
    ).all()
    return roles