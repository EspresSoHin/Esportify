from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas


router = APIRouter(
    prefix="/events",
    tags=["events"]    
) 

@router.get("/", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Events).all() 
    return events


##########################
## création d'un event C##
##########################

@router.post("/", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    new_event = models.Events(
        titre=event.titre,
        description=event.description,
        nb_joueurs_max=event.nb_joueurs_max,
        date_debut=event.date_debut,
        date_fin=event.date_fin,
        image_url=event.image_url
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


##############################
## récupération d'un event R##
##############################

@router.get("/{id}", response_model=schemas.EventResponse)
def get_event(id: int, db: Session = Depends(get_db)):
        event = db.query(models.Events).filter(models.Events.id == id).first() 
        if event is None:
            raise HTTPException(status_code=404, detail="Event not found")
        return event


###############################
## modification d'un event  U##
###############################

@router.put("/{id}", response_model=schemas.EventResponse)
def update_event(id: int, event_update: schemas.EventUpdate, db: Session = Depends(get_db)):
    event = db.query(models.Events).filter(models.Events.id == id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    if event_update.titre is not None:
        event.titre = event_update.titre
    if event_update.description is not None:
        event.description = event_update.description
    if event_update.nb_joueurs_max is not None:
        event.nb_joueurs_max = event_update.nb_joueurs_max
    if event_update.date_debut is not None:
        event.date_debut = event_update.date_debut
    if event_update.date_fin is not None:
        event.date_fin = event_update.date_fin
    if event_update.image_url is not None:
        event.image_url = event_update.image_url
    if event_update.visible is not None:
        event.visible = event_update.visible
    if event_update.discussion_active is not None:
        event.discussion_active = event_update.discussion_active
    if event_update.id_statut is not None:
        event.id_statut = event_update.id_statut

    db.commit()
    db.refresh(event)
    return event


#############################
## suppression d'un event D##
#############################

@router.delete("/{id}")
def delete_event(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Events).filter(models.Events.id == id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"detail": "Event deleted successfully"}