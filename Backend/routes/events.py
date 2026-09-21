from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from datetime import datetime, date
from Oauth2 import get_current_user, check_admin, check_orga
from services.events_service import EventsService


router = APIRouter(
    prefix="/events",
    tags=["events"]    
) 

@router.get("/", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    return EventsService(db).get_all()


##########################
## création d'un event C##
##########################

@router.post("/", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), 
                current_user: models.Users = Depends(get_current_user)):
    return EventsService(db).create(event)


##############################
## récupération d'un event R##
##############################

@router.get("/{id}", response_model=schemas.EventResponse)
def get_event(id: int, db: Session = Depends(get_db)):
        return EventsService(db).get_event_by_id(id)


###############################
## modification d'un event  U##
###############################

@router.put("/{id}", response_model=schemas.EventResponse)
def update_event(id: int, event_update: schemas.EventUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_admin)):
    return EventsService(db).update(id, event_update)


#############################
## suppression d'un event D##
#############################

@router.delete("/{id}")
def delete_event(id: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_orga)):
    return EventsService(db).delete(id)