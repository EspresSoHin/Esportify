from fastapi import FastAPI
from pydantic import BaseModel
from database import engine
from routes import users , events, inscriptions, favoris, scores

app = FastAPI()
app.include_router(users.router)
app.include_router(events.router)
app.include_router(inscriptions.router)
app.include_router(favoris.router)
app.include_router(scores.router)

