from pydantic import BaseModel, EmailStr
from enum import Enum as PydanticEnum
from datetime import datetime

class UserRole(str, PydanticEnum):
    admin = 'admin'
    user = 'user'

class UserBase(BaseModel):
    full_name: str
    mail: EmailStr

class UserCreate(UserBase):
    passhash: str
    user_status: bool = True

class UserCreateAdmin(UserBase):
    passhash: str
    user_role: UserRole
    user_status: bool = True

class UserRead(UserBase):
    user_id: str
    user_role: UserRole
    created_at: datetime
    updated_at: datetime
    user_status: bool

class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        orm_mode = True
    
    # Cuando orm_mode está habilitado, permite la conversión directa de objetos SQLAlchemy a modelos Pydantic sin necesidad de definir explícitamente todos los campos
