from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas

router = APIRouter(
    prefix="/scores",
    tags=["scores"]    
) 

@router.get("/", response_model=list[schemas.ScoresResponse])
def get_scores(db: Session = Depends(get_db)):
    scores = db.query(models.Scores).all() 
    return scores

# pas de vrai tournois dans le cadre de l'ECF donc on va faire les choses simplement for now


## ##########################
##   CREATION DE SCORES    ##
## ##########################

@router.post("/", response_model=schemas.ScoresResponse)
def create_scores(scores: schemas.ScoresCreate, db: Session = Depends(get_db)):
    new_score = models.Scores(
        id_utilisateur= scores.id_utilisateur,
        id_evenement= scores.id_evenement,
        position= scores.position,
        points= scores.points
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


#############################
## RECUPERATION DE SCORES R##
#############################

@router.get("/events/{id_evenement}", response_model=list[schemas.ScoresResponse])
def get_scores_by_event(id_evenement: int, db: Session = Depends(get_db)):
    scores = db.query(models.Scores).filter(
        models.Scores.id_evenement == id_evenement
    ).all()
    return scores


@router.get("/users/{id_utilisateur}", response_model=list[schemas.ScoresResponse])
def get_scores_by_user(id_utilisateur: int, db: Session = Depends(get_db)):
    scores = db.query(models.Scores).filter(
        models.Scores.id_utilisateur == id_utilisateur
    ).all()
    return scores


##############################
##  MODIFICATION DE SCORE  U##
##############################

@router.put("/{id}", response_model=schemas.ScoresResponse)
def update_score(id: int, score_update: schemas.ScoresUpdate, db: Session = Depends(get_db)):
    score = db.query(models.Scores).filter(models.Scores.id == id).first()
    if score is None:
        raise HTTPException(status_code=404, detail="Score not found")

    if score_update.position is not None:
        score.position = score_update.position
    if score_update.points is not None:
        score.points = score_update.points
    if score_update.resultat is not None:
        score.resultat = score_update.resultat
    
    db.commit()
    db.refresh(score)
    return score
 