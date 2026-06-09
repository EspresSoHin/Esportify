from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime, date
from typing import Optional


#bloc pour cenurer des mots dans les commentaires
class CommentaireCreate(BaseModel):
    contenu: str

    @validator('contenu')
    def censurer_mots(cls, v):
        mots_interdits = ['spam', 'insulte', ...] #listes à completer, liens, slurs, etc
        for mot in mots_interdits:
            v = v.replace(mot, '***')
        return v

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

# Pour modifier un user (tout est optionnel)
class UserUpdate(BaseModel):
    pseudo: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


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
