from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base


## ##############################
##         TABLE EVENTS        ##
## ##############################

class Events(Base):
    __tablename__ = "events"
    __table_args__ = (
        CheckConstraint('nb_joueurs_max > 1', name='chk_nb_joueurs'),
        CheckConstraint('date_fin > date_debut', name='chk_dates'),
)
    id = Column(Integer, primary_key=True, autoincrement=True)
    titre = Column(String(45), nullable=False)
    description = Column(String(200), nullable=False)
    nb_joueurs_max = Column(Integer, nullable=False)
    date_debut = Column(DateTime, nullable=False)
    date_fin = Column(DateTime, nullable=False)
    visible = Column(Boolean, nullable=False, default=False)
    discussion_active = Column(Boolean, nullable=False, default=True)
    image_url = Column(String(500), nullable=True)
    id_organisateur = Column(Integer, ForeignKey('users.id'), nullable=False)
    id_statut = Column(Integer, ForeignKey('statuts_evenement.id'), nullable=False, default=3)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=True)
    organisateur = relationship("Users", back_populates="evenements_organises")
    statut = relationship("StatutsEvenement", back_populates="events")
    inscriptions = relationship("InscriptionsEv", back_populates="event")
    favoris = relationship("Favoris", back_populates="event")
    scores = relationship("Scores", back_populates="event")