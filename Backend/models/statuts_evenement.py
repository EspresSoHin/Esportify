from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base


## ##############################
##  TABLE STATUTS_EVENEMENT  ##
## ##############################

class StatutsEvenement(Base):
    __tablename__ = "statuts_evenement"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    events = relationship("Events", back_populates="statut")
