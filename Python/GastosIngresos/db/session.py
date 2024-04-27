from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.config import settings

DB_URL = settings.DATABASE_URL

# Crear una instancia de motor SQLAlchemy
engine = create_engine(DB_URL)

# Crear una instancia de sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear una clase base para las clases de modelo
Base = declarative_base()

# Función para crear la sesión de base de datos
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
