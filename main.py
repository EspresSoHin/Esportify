from fastapi import FastAPI
from pydantic import BaseModel
from database import engine

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}

#You already created an API that:

#Receives HTTP requests in the paths / and /items/{item_id}.
#Both paths take GET operations (also known as HTTP methods).
#The path /items/{item_id} has a path parameter item_id that should be an int.
#The path /items/{item_id} has an optional str query parameter query.