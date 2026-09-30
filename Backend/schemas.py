from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime, date
from typing import Optional
import re


## ################################
##         CREATION USERS        ##
## ################################

# les inputs du front end pour créer un user
class UserCreate(BaseModel):
    pseudo: str
    password: str = Field(max_length=72)
    email: EmailStr

# Ce que l'API renvoie (jamais le password !)
class UserResponse(BaseModel):
    id: int
    pseudo: str
    email: EmailStr
    id_role: int
    created_at: datetime

    class Config:
        from_attributes = True  # permet de lire un objet SQLAlchemy directement

#pour la route /me, on renvoie juste les infos publiques
class UserPublicResponse(BaseModel):
    id: int
    pseudo: str
    id_role: int
    created_at: datetime

    class Config:
        from_attributes = True

# Pour modifier un user (tout est optionnel)
class UserUpdate(BaseModel):
    pseudo: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    id_role: Optional[int] = None


## ##############################
##       CREATION EVENTS       ##
## ##############################

class EventCreate(BaseModel):
    titre: str
    description: str
    nb_joueurs_max: int
    date_debut: datetime
    date_fin: datetime
    image_url: Optional[str] = None
    id_organisateur: int

class EventResponse(BaseModel):
    id: int
    titre: str
    description: str
    nb_joueurs_max: int
    date_debut: datetime
    date_fin: datetime
    visible: bool
    discussion_active: bool
    image_url: Optional[str] = None
    id_statut: int
    id_organisateur: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EventUpdate(BaseModel):
    titre: Optional[str] = None
    description: Optional[str] = None
    nb_joueurs_max: Optional[int] = None
    date_debut: Optional[datetime] = None
    date_fin: Optional[datetime] = None
    image_url: Optional[str] = None
    visible: Optional[bool] = None
    discussion_active: Optional[bool] = None
    id_statut: Optional[int] = None


## ##############################
##      INSCRIPTION EVENTS     ##
## ##############################

class InscriptionCreate(BaseModel):
    id_utilisateur: int
    id_evenement: int

class InscriptionResponse(BaseModel):
    id: int
    id_utilisateur: int
    id_evenement: int
    date_inscription: datetime
    id_statut_inscription: int

    class Config:
        from_attributes = True

class InscriptionUpdate(BaseModel):
    id_statut_inscription: Optional[int] = None


## ##############################
##           FAVORIS           ##
## ##############################

class FavorisCreate(BaseModel):
    id_utilisateur: int
    id_evenement: int

class FavorisResponse(BaseModel):
    id: int
    id_utilisateur: int
    id_evenement: int

    class Config:
        from_attributes = True

## ##############################
##           SCORES            ##
## ##############################

class ScoresCreate(BaseModel):
    id_utilisateur: int
    id_evenement: int
    position: int
    points: int
    resultat: Optional[str] = None
    date_score: Optional[date] = None


class ScoresResponse(BaseModel):
    id: int
    id_utilisateur: int
    id_evenement: int
    position: int
    points: int
    resultat: Optional[str] = None
    date_score: date

    class Config:
        from_attributes = True

class ScoresUpdate(BaseModel):
    position: Optional[int] = None
    points: Optional[int] = None
    resultat: Optional[str] = None

## ##############################
##            ROLES            ##
## ##############################

class RoleCreate(BaseModel):
    nom: str

class RoleResponse(BaseModel):
    id: int
    nom: str

    class Config:
        from_attributes = True


## ##############################
##     STATUTS INSCRIPTION     ##
## ##############################

class StatutInscriptionCreate(BaseModel):
    nom: str

class StatutInscriptionResponse(BaseModel):
    id: int
    nom: str

    class Config:
        from_attributes = True

## ##############################
##     STATUTS EVENEMENT       ##
## ##############################

class StatutEvenementCreate(BaseModel):
    nom: str

class StatutEvenementResponse(BaseModel):
    id: int
    nom: str

    class Config:
        from_attributes = True


## ##############################
##        MESSAGES CHAT        ##
## ##############################


MOTS_INTERDITS = ["spam", "insulte"]  # à compléter

#Regex pour la casse et pour les liens
_RE_MOTS = re.compile(
    r"\b(" + "|".join(map(re.escape, MOTS_INTERDITS)) + r")\b", re.IGNORECASE
)

_RE_LIENS = re.compile(
    r"""
    (?:
        (?:https?|ftp)://\S+
      | www\.\S+
      | \b(?:[a-z0-9-]+\.)+(?:com|fr|net|org|gg|io|tv|me|ly|be|xyz)\b(?:/\S*)?
    )
    """,
    re.IGNORECASE | re.VERBOSE,
)


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=500)

    @field_validator("content")
    @classmethod
    def moderer(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Le message ne peut pas être vide.")
        v = _RE_LIENS.sub("[lien supprimé]", v)
        v = _RE_MOTS.sub("***", v)
        return v

class MessageResponse(BaseModel):
    id: str #pas un int car sur mongo c'est ObjectId 
    id_utilisateur: int
    id_evenement: int
    author: str
    content: str
    created_at: datetime
