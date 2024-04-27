
from dotenv import load_dotenv
import os
dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)
class Settings:
    PROJECT_NAME: str = "GastosIngresos"
    PROJECT_VERSION: str = "0.0.1"
    PROJECT_DESCRIPTION: str = "Software Administracion de creditos"

    DB_HOST: str =os.getenv("DB_HOST")
    DB_USER: str =os.getenv("DB_USER")
    DB_PASSWORD: str =os.getenv("DB_PASSWORD")
    DB_NAME: str =os.getenv("DB_NAME")
    DB_PORT: str =os.getenv("DB_PORT")

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    SECRET_KEY:str = os.getenv("SECRET_KEY")
    TOKEN_EXPIRE_MIN=960
    ALGORITHM= os.getenv("ALGORITHM")

settings= Settings()   