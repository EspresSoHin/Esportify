from bson import ObjectId
from bson.errors import InvalidId


class MessagesRepository:
    def __init__(self, db):
        self.collection = db["ChatMessages"]

    async def create(self, document: dict) -> dict:
        result = await self.collection.insert_one(document)
        document.pop("_id", None)  # insert_one ajoute _id au dict
        document["id"] = str(result.inserted_id)
        return document

    async def get_by_event(self, id_evenement: int, limit: int = 100) -> list[dict]:
        cursor = (
            self.collection.find({"id_evenement": id_evenement})
            .sort("created_at", -1)
            .limit(limit)
        )
        messages = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            messages.append(doc)
        messages.reverse()  # on affiche du plus ancien au plus récent
        return messages


    async def delete(self, id: str) -> dict | None:
        try:
            oid = ObjectId(id)
        except InvalidId:
            return None  # id mal formé : le service renverra une 404

        doc = await self.collection.find_one_and_delete({"_id": oid})
        if doc is None:
            return None

        doc["id"] = str(doc.pop("_id"))
        return doc