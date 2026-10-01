from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from Oauth2 import get_current_user, check_orga, check_admin
from services.inscriptions_service import InscriptionsService

router = APIRouter(
    prefix="/inscriptions",
    tags=["inscriptions"]    
) 

@router.get("/", response_model=list[schemas.InscriptionResponse])
def get_inscriptions(db: Session = Depends(get_db)):
    return InscriptionsService(db).get_all()



## ##############################
##   CREATION D'INSCRIPTION    ##
## ##############################

@router.post("/", response_model=schemas.InscriptionResponse)
def create_inscriptions(inscription: schemas.InscriptionCreate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    return InscriptionsService(db).create(inscription, current_user)


#####################################
## récupération d'une inscription R##
#####################################

@router.get("/{id_inscription}", response_model=schemas.InscriptionResponse)
def get_inscription(id_inscription: int, db: Session = Depends(get_db)):
    return InscriptionsService(db).get_inscription(id_inscription)


##################################
## modification d'inscription  U##
##################################

@router.patch("/{id}", response_model=schemas.InscriptionResponse)
def patch_inscription(id: int, inscription_patch: schemas.InscriptionUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(check_orga)):
    return InscriptionsService(db).update(id, inscription_patch)


####################################
## suppression d'une inscription D##
####################################

@router.delete("/{id}")
def delete_inscription(id: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    return InscriptionsService(db).delete(id, current_user)