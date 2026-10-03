from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..utils.password import hash_password, verify_password
from ..auth.jwt import create_access_token
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user"
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new customer account."""
    existing_user = db.query(User).filter(User.email == user_data.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )

    hashed_pw = hash_password(user_data.password)
    new_user = User(
        name=user_data.name.strip(),
        email=user_data.email.lower().strip(),
        password_hash=hashed_pw,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post(
    "/login",
    response_model=Token,
    summary="Login and obtain JWT access token"
)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email & password and return a JWT bearer token."""
    user = db.query(User).filter(User.email == login_data.email.lower().strip()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is disabled"
        )

    token = create_access_token(data={"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user profile"
)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Fetch the authenticated user's profile details."""
    return current_user

