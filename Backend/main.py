from fastapi import FastAPI
from pydantic import BaseModel
from database import engine
from routes import users #on ajoutera les autres routes au fur et à mesure

app = FastAPI()
app.include_router(users.router) #on inclut les routes des utilisateurs, on fera pareil pour les autres routes



class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None

