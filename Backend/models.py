from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date

Base = declarative_base() #la classe pour chaque table


## ##############################
##         TABLE ROLES         ##
## ##############################

class Roles(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    users = relationship("Users", back_populates="role")

## ##############################
##         TABLE USERS         ##
## ##############################

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pseudo = Column(String(45), nullable=False, unique=True)
    password = Column(String(255), nullable=False) 
    email = Column(String(255), nullable=False, unique=True)
    id_role = Column(Integer, ForeignKey('roles.id'), nullable=False, default=1)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=True)
    role = relationship("Roles", back_populates="users")
    inscriptions = relationship("InscriptionsEv", back_populates="user")
    favoris = relationship("Favoris", back_populates="user")
    scores = relationship("Scores", back_populates="user")
    evenements_organises = relationship("Events", back_populates="organisateur")

## ##############################
##  TABLE STATUTS_INSCRIPTION  ##
## ##############################

class StatutsInscription(Base):
    __tablename__ = "statuts_inscription"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    inscriptions = relationship("InscriptionsEv", back_populates="statut_inscription")

## ##############################
##  TABLE STATUTS_EVENEMENT  ##
## ##############################

class StatutsEvenement(Base):
    __tablename__ = "statuts_evenement"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    events = relationship("Events", back_populates="statut")

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
    image_url = Column(String(100), nullable=True)
    id_organisateur = Column(Integer, ForeignKey('users.id'), nullable=False)
    id_statut = Column(Integer, ForeignKey('statuts_evenement.id'), nullable=False, default=3)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=True)
    organisateur = relationship("Users", back_populates="evenements_organises")
    statut = relationship("StatutsEvenement", back_populates="events")
    inscriptions = relationship("InscriptionsEv", back_populates="event")
    favoris = relationship("Favoris", back_populates="event")
    scores = relationship("Scores", back_populates="event")


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


