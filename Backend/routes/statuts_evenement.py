from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas


router = APIRouter(
    prefix="/statuts_evenement",
    tags=["statuts_evenement"]    
) 

@router.get("/", response_model=list[schemas.StatutEvenementResponse])
def get_statuts_evenement(db: Session = Depends(get_db)):
    statuts_evenement = db.query(models.StatutsEvenement).all() 
    return statuts_evenement

# ON GARDE QUE GET POUR AFFICHER LES STATUTS
# LES MODIFS DE STATUS SE FONT VIA LA ROUTE EVENTS