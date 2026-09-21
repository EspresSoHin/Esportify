from sqlalchemy.orm import Session
import schemas
from fastapi import HTTPException
from repositories.events_repository import EventsRepository


class EventsService:
    def __init__(self, db: Session):
        self.repo = EventsRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def create(self, event: schemas.EventCreate):
        return self.repo.create(
            event.titre,event.description,event.nb_joueurs_max,event.date_debut,event.date_fin,event.image_url,event.id_organisateur)

    def get_event_by_id(self, id: int):
        event = self.repo.get_event_by_id(id)
        if event is None:
            raise HTTPException(status_code=404, detail="Event not found")
        return event

    def update(self, id: int, event_update: schemas.EventUpdate):
        event = self.repo.update(id, event_update)
        if event is None:
            raise HTTPException(status_code=404, detail="Event not found")
        return event

    def delete(self, id: int):
        event = self.repo.delete(id)
        if event is None:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"detail": "Event deleted successfully"}


