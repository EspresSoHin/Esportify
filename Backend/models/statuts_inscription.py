from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base


## ##############################
##  TABLE STATUTS_INSCRIPTION  ##
## ##############################

class StatutsInscription(Base):
    __tablename__ = "statuts_inscription"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    inscriptions = relationship("InscriptionsEv", back_populates="statut_inscription")