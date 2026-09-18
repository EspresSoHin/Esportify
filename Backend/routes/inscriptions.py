from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from sqlalchemy.exc import IntegrityError
from database import get_db
import models, schemas
from Oauth2 import get_current_user, check_orga, check_admin

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
    if current_user.id != inscription.id_utilisateur and current_user.id_role not in (2, 3):
        raise HTTPException(status_code=403, detail="Tu ne peux pas inscrire un autre utilisateur.")

    new_inscription = models.InscriptionsEv(
        id_utilisateur= inscription.id_utilisateur,
        id_evenement= inscription.id_evenement
    )

    db.add(new_inscription)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Tu es déjà inscrit à cet événement.")
    
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
                current_user: models.Users = Depends(check_orga)):
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
    
    if current_user.id != inscription.id_utilisateur and current_user.id_role not in (2, 3):
        raise HTTPException(status_code=403, detail="Tu ne peux pas supprimer l'inscription d'un autre utilisateur.")

    
    db.delete(inscription)
    db.commit()
    return {"detail": "Inscription deleted successfully"}