from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base

## ##############################
##         TABLE SCORES        ##
## ##############################

class Scores(Base):
    __tablename__ = "scores"
    __table_args__ = (
        CheckConstraint('position > 0', name='chk_position_positive'),
)
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateur = Column(Integer, ForeignKey('users.id'), nullable=False)
    id_evenement = Column(Integer, ForeignKey('events.id'), nullable=False)
    position = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False, default=0)
    resultat = Column(String(45), nullable=True)
    date_score = Column(Date, nullable=False, default=date.today) #date.today() pas date.now() pour éviter d'avoir l'heure dans la date_score
    user = relationship("Users", back_populates="scores")
    event = relationship("Events", back_populates="scores")
