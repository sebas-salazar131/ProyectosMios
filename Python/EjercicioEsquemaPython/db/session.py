from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.config import settings

DB_URL = settings.DATABASE_URL
#crea una instancia de motor SQLALCHEMY
engine = create_engine(DB_URL)
#crea una instancia de sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#crea una clase base para las clase modelo
Base = declarative_base()

#funcion para crear la sesion de la base de datos
def get_session():
    session =SessionLocal()
    try:
        yield session
    finally: 
        session.close()
