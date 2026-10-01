from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from mongodb import get_mongo_db
import models, schemas
from Oauth2 import get_current_user, check_admin
from services.messages_service import MessagesService

router = APIRouter(tags=["messages"])


@router.get("/events/{id_evenement}/messages", response_model=list[schemas.MessageResponse])
async def get_messages(id_evenement: int, mongo_db=Depends(get_mongo_db)):
    return await MessagesService(mongo_db).get_by_event(id_evenement)


@router.post("/events/{id_evenement}/messages", response_model=schemas.MessageResponse)
async def create_message(id_evenement: int, message: schemas.MessageCreate,
                         mongo_db=Depends(get_mongo_db),
                         sql_db: Session = Depends(get_db),
                         current_user: models.Users = Depends(get_current_user)):
    return await MessagesService(mongo_db, sql_db).create(id_evenement, message, current_user)


@router.delete("/messages/{id}")
async def delete_message(id: str, mongo_db=Depends(get_mongo_db),
                         current_user: models.Users = Depends(check_admin)):
    return await MessagesService(mongo_db).delete(id)