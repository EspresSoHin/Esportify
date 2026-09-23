from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base

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