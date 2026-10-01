from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base


## ##############################
##    TABLE INSCRIPTIONS_EV    ##
## ##############################

class InscriptionsEv(Base):
    __tablename__ = "inscriptions_ev"
    __table_args__ = (
        UniqueConstraint('id_utilisateur', 'id_evenement', name='uq_inscription_user_event'),
)
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_utilisateur = Column(Integer, ForeignKey('users.id'), nullable=False)
    id_evenement = Column(Integer, ForeignKey('events.id'), nullable=False)
    date_inscription = Column(DateTime, nullable=False, default=datetime.now)
    id_statut_inscription = Column(Integer, ForeignKey('statuts_inscription.id'), nullable=False, default=1)
    user = relationship("Users", back_populates="inscriptions")
    event = relationship("Events", back_populates="inscriptions")
    statut_inscription = relationship("StatutsInscription", back_populates="inscriptions")