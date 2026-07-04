from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from database import get_db
import models, schemas
from Oauth2 import get_current_user

router = APIRouter(
    prefix="/favoris",
    tags=["favoris"]    
) 

@router.get("/", response_model=list[schemas.FavorisResponse])
def get_favoris(db: Session = Depends(get_db)):
    favoris = db.query(models.Favoris).all() 
    return favoris


############################
## création d'un favoris C##
############################

@router.post("/", response_model=schemas.FavorisResponse)
def create_favoris(favoris: schemas.FavorisCreate, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    new_favoris = models.Favoris(
        id_utilisateur=favoris.id_utilisateur,
        id_evenement=favoris.id_evenement
    )

    db.add(new_favoris)
    db.commit()
    db.refresh(new_favoris)
    return new_favoris


################################
## récupération d'un favoris R##
################################

#pour GET on prends l'utilisateur parce que c'est chez lui qu'on va voir les favs
@router.get("/users/{id_utilisateur}", response_model=list[schemas.FavorisResponse]) #une liste car un user peut avoir plusieurs favoris
def get_favoris_by_user(id_utilisateur: int, db: Session = Depends(get_db)):
    favoris = db.query(models.Favoris).filter(
        models.Favoris.id_utilisateur == id_utilisateur  # variable locale de l'URL
    ).all()
    return favoris


################################
## suppression d'un favoris  D##
################################

#pour delete on a besoin des deux
@router.delete("/{id_utilisateur}/{id_evenement}")
def delete_favoris(id_utilisateur: int, id_evenement: int, db: Session = Depends(get_db),
                current_user: models.Users = Depends(get_current_user)):
    favoris = db.query(models.Favoris).filter(
        models.Favoris.id_utilisateur == id_utilisateur,
        models.Favoris.id_evenement == id_evenement
    ).first()
    if favoris is None:
        raise HTTPException(status_code=404, detail="Favoris not found")
    db.delete(favoris)
    db.commit()
    return {"detail": "Favoris deleted successfully"}