from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from Oauth2 import get_current_user

router = APIRouter(
    prefix="/inscriptions",
    tags=["inscriptions"]    
) 

@router.get("/", response_model=list[schemas.InscriptionResponse])
def get_inscriptions(db: Session = Depends(get_db)):
    inscriptions = db.query(models.InscriptionsEv).all() 
    return inscriptions


## ##############################
##   CREATION D'INSCRIPTION    ##
## ##############################

@router.post("/", response_model=schemas.InscriptionResponse)
def create_inscriptions(inscription: schemas.InscriptionCreate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    new_inscription = models.InscriptionsEv(
        id_utilisateur= inscription.id_utilisateur,
        id_evenement= inscription.id_evenement
    )

    db.add(new_inscription)
    db.commit()
    db.refresh(new_inscription)
    return new_inscription


#####################################
## récupération d'une inscription R##
#####################################

@router.get("/{id_inscription}", response_model=schemas.InscriptionResponse)
def get_inscription(id_inscription: int, db: Session = Depends(get_db)):
    inscription = db.query(models.InscriptionsEv).filter(
        models.InscriptionsEv.id == id_inscription
    ).first()
    if inscription is None:
            raise HTTPException(status_code=404, detail="Inscription not found")
    return inscription


##################################
## modification d'inscription  U##
##################################

@router.patch("/{id}", response_model=schemas.InscriptionResponse)
def patch_inscription(id: int, inscription_patch: schemas.InscriptionUpdate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    inscription = db.query(models.InscriptionsEv).filter(models.InscriptionsEv.id == id).first()
    if inscription is None:
        raise HTTPException(status_code=404, detail="Inscription not found")

    if inscription_patch.id_statut_inscription is not None:
        inscription.id_statut_inscription = inscription_patch.id_statut_inscription
    
    db.commit()
    db.refresh(inscription)
    return inscription


####################################
## suppression d'une inscription D##
####################################

@router.delete("/{id}")
def delete_inscription(id: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    inscription = db.query(models.InscriptionsEv).filter(models.InscriptionsEv.id == id).first()
    if inscription is None:
        raise HTTPException(status_code=404, detail="Inscription not found")
    
    db.delete(inscription)
    db.commit()
    return {"detail": "Inscription deleted successfully"}