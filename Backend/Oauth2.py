from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request
from database import get_db
from sqlalchemy.orm import Session 
import models

##ON A PRIS LA SECRET KEY DANS ENV
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

## Protection des routes ##

def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Non connecté")
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user = db.query(models.Users).filter(models.Users.pseudo == payload).first()
    if not user:
        raise HTTPException(status_code=404, detail="User introuvable")
    
    return user

#####Pour vérifier le role de l'utilisateur (admin ou pas) pour certaines routes

def check_admin(current_user: models.Users = Depends(get_current_user)):
    if current_user.id_role != 2:  # 2 = admin
        raise HTTPException(status_code=403, detail="Accès refusé — admin requis")
    return current_user

def check_orga(current_user: models.Users = Depends(get_current_user)):
    if current_user.id_role not in [2, 3]:  # 2 = admin, 3 = orga
        raise HTTPException(status_code=403, detail="Accès refusé — organisateur requis")
    return current_user