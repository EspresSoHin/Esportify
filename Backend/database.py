#On branche sur la base de données PostgreSQL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine + session
engine = create_engine(DATABASE_URL) #le moteur vroum vroum
SessionLocal = sessionmaker(bind=engine) #le contact click *bruit de bmw qui s'allume*

# get db on démarre la bagnole tiktiktiktik vrrrrr

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()