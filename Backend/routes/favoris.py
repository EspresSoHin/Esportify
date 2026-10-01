from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from sqlalchemy.exc import IntegrityError
from database import get_db
import models, schemas
from Oauth2 import get_current_user
from services.favoris_service import FavorisService

router = APIRouter(
    prefix="/favoris",
    tags=["favoris"]    
) 

@router.get("/", response_model=list[schemas.FavorisResponse])
def get_favoris(db: Session = Depends(get_db)):
    return FavorisService(db).get_all()


############################
## création d'un favoris C##
############################

@router.post("/", response_model=schemas.FavorisResponse)
def create_favoris(favoris: schemas.FavorisCreate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    return FavorisService(db).create(favoris)


################################
## récupération d'un favoris R##
################################

#pour GET on prends l'utilisateur parce que c'est chez lui qu'on va voir les favs
@router.get("/users/{id_utilisateur}", response_model=list[schemas.FavorisResponse]) #une liste car un user peut avoir plusieurs favoris
def get_favoris_by_user(id_utilisateur: int, db: Session = Depends(get_db)):
    return FavorisService(db).get_by_user(id_utilisateur)


################################
## suppression d'un favoris  D##
################################

#pour delete on a besoin des deux
@router.delete("/{id_utilisateur}/{id_evenement}")
def delete_favoris(id_utilisateur: int, id_evenement: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    return FavorisService(db).delete(id_utilisateur, id_evenement, current_user)
