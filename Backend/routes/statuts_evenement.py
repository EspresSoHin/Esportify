from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from services.statuts_ev_service import StatutsEvService


router = APIRouter(
    prefix="/statuts_evenement",
    tags=["statuts_evenement"]    
) 

@router.get("/", response_model=list[schemas.StatutEvenementResponse])
def get_statuts_evenement(db: Session = Depends(get_db)):
    return StatutsEvService(db).get_all()