from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base

## ##############################
##        TABLE FAVORIS        ##
## ##############################

class Favoris(Base):
    __tablename__ = "favoris"
    __table_args__ = (
        UniqueConstraint('id_evenement', 'id_utilisateur', name='uq_favoris_event_user'),
)
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_evenement = Column(Integer, ForeignKey('events.id'), nullable=False)
    id_utilisateur = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship("Users", back_populates="favoris")
    event = relationship("Events", back_populates="favoris")