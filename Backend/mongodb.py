#On branche sur la base de données MongoDB
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

load_dotenv()

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = quote_plus(os.getenv("MONGO_PASSWORD"))  # encode @ : / etc.
MONGO_HOST = os.getenv("MONGO_HOST")  # esportifychat.nif2fsl.mongodb.net
MONGO_DB = os.getenv("MONGO_DB", "EsportifyChat")

MONGO_URI = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}/?appName=EsportifyChat"

client = AsyncMongoClient(MONGO_URI, tz_aware=True)
mongo_db = client[MONGO_DB]

def get_mongo_db():
    return mongo_db