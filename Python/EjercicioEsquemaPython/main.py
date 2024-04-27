from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import datetime
from db.session import get_session
from sqlalchemy.orm import Session
from models.users import User
# class Numero(BaseModel):
#     num: int

class Fecha(BaseModel):
    timestamp: datetime
        

class Letras(BaseModel):
    letra: str
    

app= FastAPI()



@app.post("/test")
async def test_db(db: Session= Depends(get_session)):
    result = db.query(User).all()
    return {"result: ": result}

@app.post("/fecha")
async def fecha(nombre: Letras, fecha:Fecha):
    
    mes= fecha.timestamp.strftime('%m')
    faltante=int(mes)
    falta= 12-faltante
    return{
            "Hola": nombre.letra,
            "para dicimbre falta meses": falta, "compaltan"
            "se siente que viene diciembreee": "juas"
            }