from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.security import create_access_token, verify_token
from db.session import get_session
from appv1.schemas.users import UserCreate, UserCreateAdmin, UserRead, Token
from appv1.crud.users import create_new_user, get_user_by_email, get_user_by_id, authenticate_user, get_all_user

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_session)
):
    user_id = await verify_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_db = get_user_by_id(user_id, db)
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db

# Ruta para el inicio de sesión
@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token( data={"sub": user.user_id} )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/create-user/", response_model=UserRead)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_session)
):  
    verify_user = get_user_by_email(user.mail, db)
    if verify_user is None:
        created_user = create_new_user(user, 'user', db)
        return created_user  # Aquí devolvemos el nuevo usuario creado, que debería ser de tipo UserRead
    
    raise HTTPException(status_code=404, detail="User already exists")
    
@router.post("/create-admin/", response_model=UserRead)
async def create_user(
    user: UserCreateAdmin,
    db: Session = Depends(get_session),
    current_user: UserRead = Depends(get_current_user)
):  
    if current_user.user_role == 'admin':
        verify_user = get_user_by_email(user.mail, db)
        if verify_user is None:
            created_user = create_new_user(user, user.user_role, db)
            return created_user  # Aquí devolvemos el nuevo usuario creado, que debería ser de tipo UserRead
        
        raise HTTPException(status_code=404, detail="User already exists")
    raise HTTPException(status_code=401, detail="Not authorized")

@router.get("/get/{user_id}", response_model=UserRead)
def read_user(
    user_id: str,
    db: Session = Depends(get_session),
    current_user: UserRead = Depends(get_current_user)
):
    if current_user.user_role == 'admin' or current_user.user_id == user_id:
        user = get_user_by_id(user_id, db)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    raise HTTPException(status_code=401, detail="Invalid Token")

   

@router.get("/get/", response_model=List[UserRead])
def read_users(db: Session = Depends(get_session), current_user: UserRead = Depends(get_current_user)):
    if current_user.user_role == "admin":
        users = get_all_user(db)
        return users
    raise HTTPException(status_code=401, detail="Invalid Token")