from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from Oauth2 import create_access_token, decode_token
from routes import users , events, inscriptions, favoris, scores, auth, statuts_evenement, roles


app = FastAPI()
oauth2_scheme = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",   # local Live Server
        "http://localhost:5500",    # d local alternative
        "https://esportify-fr.onrender.com/"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(users.router)
app.include_router(events.router)
app.include_router(inscriptions.router)
app.include_router(favoris.router)
app.include_router(scores.router)
app.include_router(auth.router)
app.include_router(statuts_evenement.router)
app.include_router(roles.router)