import schemas, models
from fastapi import HTTPException
from datetime import datetime, timezone
from repositories.messages_repository import MessagesRepository

class MessagesService:
    def __init__(self, mongo_db, sql_db=None):
        self.repo = MessagesRepository(mongo_db)
        self.sql_db = sql_db

    async def create(self, id_evenement: int, message: schemas.MessageCreate,
                     current_user: models.Users):
        event = self.sql_db.query(models.Events).filter(
            models.Events.id == id_evenement
        ).first()
        if event is None:
            raise HTTPException(status_code=404, detail="Événement introuvable")
        if not event.discussion_active:
            raise HTTPException(status_code=403, detail="La discussion est désactivée pour cet événement.")

        document = {
            "id_evenement": id_evenement,
            "id_utilisateur": current_user.id,
            "author": current_user.pseudo,
            "content": message.content,
            "created_at": datetime.now(timezone.utc),
        }
        return await self.repo.create(document)


    async def get_by_event(self, id_evenement: int):
        return await self.repo.get_by_event(id_evenement)


    async def delete(self, id: str):
        message = await self.repo.delete(id)
        if message is None:
            raise HTTPException(status_code=404, detail="Message introuvable")
        return {"detail": "Message supprimé"}

   