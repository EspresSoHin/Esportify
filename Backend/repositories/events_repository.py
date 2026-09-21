import models, schemas
from sqlalchemy.orm import Session
from datetime import datetime


class EventsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(models.Events).all()

    def create(self, titre: str, description: str, nb_joueurs_max: int, date_debut: datetime, date_fin: datetime, image_url: str, id_organisateur: int):
        new_event = models.Events(
        titre=titre,
        description=description,
        nb_joueurs_max=nb_joueurs_max,
        date_debut=date_debut,
        date_fin=date_fin,
        image_url=image_url,
        id_organisateur=id_organisateur
    )
        self.db.add(new_event)
        self.db.commit()
        self.db.refresh(new_event)
        return new_event

    def get_event_by_id(self, event_id: int):
        return self.db.query(models.Events).filter(models.Events.id == event_id).first()

    def update(self, id: int, event_update: schemas.EventUpdate):
        event = self.db.query(models.Events).filter(models.Events.id == id).first()
    
        if event is None:
            return None

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

        event.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(event)
        return event


    def delete(self, id: int):
        event = self.db.query(models.Events).filter(models.Events.id == id).first()
        if event is None:
            return None
        self.db.delete(event)
        self.db.commit()
        return event
