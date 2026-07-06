from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import models, schemas
from Oauth2 import create_access_token, decode_token

router = APIRouter(tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"])


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = (
        db.query(models.Users).filter(models.Users.pseudo == form_data.username).first()
    )

    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiant ou mot de passe incorrect",
        )

    token = create_access_token(
        data={"sub": user.pseudo, "id": user.id, "role": user.id_role}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "pseudo": user.pseudo,
        "id": user.id,
        "id_role": user.id_role,
    }


@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(models.Users)
        .filter(
            (models.Users.pseudo == user.pseudo) | (models.Users.email == user.email)
        )
        .first()
    )


    if existing:
        raise HTTPException(status_code=400, detail="Pseudo ou email déjà utilisé")

    hashed = pwd_context.hash(user.password[:72])
    new_user = models.Users(pseudo=user.pseudo, email=user.email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Compte créé avec succès"}



   # On set le cookie HttpOnly — JS ne peut pas y accéder
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,       # inaccessible au JS
        secure=True,        # passer à True en production (HTTPS)
        samesite="lax",      # protection CSRF de base. Je mets pas 'strict' parce que RickRoll
        max_age=3600         # 1 heure
    )

    # On renvoie juste les infos non sensibles pour le frontend
    return {
        "access_token": token,
        "pseudo": user.pseudo,
        "id": user.id,
        "id_role": user.id_role
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Déconnecté"}


#Pour la persistence des login

@router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):
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
    
    return {
        "pseudo": user.pseudo,
        "id": user.id,
        "id_role": user.id_role
    }


# ============================================
# VALIDATION PAR EMAIL (non implémenté)      #
# Nécessite : pip install fastapi-mail       #
# ============================================

# from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
# from itsdangerous import URLSafeTimedSerializer

# conf = ConnectionConfig(
#     MAIL_USERNAME = "contact@esportify.gg",
#     MAIL_PASSWORD = "motdepasse", #dans .env
#     MAIL_FROM = "contact@esportify.gg",
#     MAIL_PORT = 587,
#     MAIL_SERVER = "smtp.gmail.com",
#     MAIL_STARTTLS = True,
#     MAIL_SSL_TLS = False,
# )

# serializer = URLSafeTimedSerializer(SECRET_KEY)

# async def send_verification_email(email: str):
#     token = serializer.dumps(email, salt="email-verify")
#     verify_url = f"https://esportify.gg/verify?token={token}"
#     message = MessageSchema(
#         subject="Confirme ton compte Esportify",
#         recipients=[email],
#         body=f"Clique ici pour confirmer : {verify_url}",
#         subtype="plain"
#     )
#     fm = FastMail(conf)
#     await fm.send_message(message)

# @router.get("/verify")
# def verify_email(token: str, db: Session = Depends(get_db)):
#     try:
#         email = serializer.loads(token, salt="email-verify", max_age=3600)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Lien invalide ou expiré")
#     user = db.query(models.Users).filter(models.Users.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="Utilisateur introuvable")
#     user.email_verifie = True  # nécessite colonne email_verifie en BDD
#     db.commit()
#     return {"message": "Email confirmé, tu peux te connecter"}


# ============================================
# FORMULAIRE DE CONTACT — EMAIL (de l'admin) 
# Configurer un serveur SMTP (ex: Gmail, Outlook)
# ============================================

# @router.post("/contact")
# async def send_contact_email(
#     prenom: str, nom: str, email: str, message: str
# ):
#     msg = MessageSchema(
#         subject=f"[Esportify] Message de {prenom} {nom}",
#         recipients=["contact@esportify.gg"],  # adresse de destination
#         body=f"De : {email}\n\n{message}",
#         subtype="plain"
#     )
#     fm = FastMail(conf)  # conf = même config que validation email
#     await fm.send_message(msg)
#    return {"message": "Email envoyé avec succès"}

# Côté frontend, fetch vers /contact avec les données du formulaire :
# await fetch(`${API_URL}/contact`, {
#     method: 'POST',
#     headers: { 'Content-Type': 'application/json' },
#     body: JSON.stringify({ prenom, nom, email, message })
# });