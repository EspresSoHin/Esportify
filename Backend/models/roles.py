from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, date
from .base import Base


## ##############################
##         TABLE ROLES         ##
## ##############################

class Roles(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(45), nullable=False, unique=True)
    users = relationship("Users", back_populates="role")