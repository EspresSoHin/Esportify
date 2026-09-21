from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from sqlalchemy.exc import IntegrityError
from Oauth2 import get_current_user, check_admin
from services.scores_service import ScoresService

router = APIRouter(
    prefix="/scores",
    tags=["scores"]    
) 

@router.get("/", response_model=list[schemas.ScoresResponse])
def get_scores(db: Session = Depends(get_db)):
    return ScoresService(db).get_all()


## ##########################
##   CREATION DE SCORES    ##
## ##########################

@router.post("/", response_model=schemas.ScoresResponse)
def create_scores(scores: schemas.ScoresCreate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    return ScoresService(db).create(scores)


#############################
## RECUPERATION DE SCORES R##
#############################

@router.get("/events/{id_evenement}", response_model=list[schemas.ScoresResponse])
def get_scores_by_event(id_evenement: int, db: Session = Depends(get_db)):
    return ScoresService(db).get_by_event(id_evenement)


@router.get("/users/{id_utilisateur}", response_model=list[schemas.ScoresResponse])
def get_scores_by_user(id_utilisateur: int, db: Session = Depends(get_db)):
    return ScoresService(db).get_by_user(id_utilisateur)


##############################
##  MODIFICATION DE SCORE  U##
##############################

@router.put("/{id}", response_model=schemas.ScoresResponse)
def update_score(id: int, score_update: schemas.ScoresUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    return ScoresService(db).update(id, score_update)
 