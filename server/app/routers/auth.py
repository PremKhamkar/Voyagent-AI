import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.models import User
from app.db.session import get_db
from app.models.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

bearer_scheme = HTTPBearer()


# ============================================================
# Shared dependency — any future protected route
# (e.g. Saved Trips in Phase 5) can reuse this the same way.
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload.get("sub"))

    except (jwt.PyJWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found.",
        )

    return user


# ============================================================
# Register
# ============================================================

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=201,
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):

    existing = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


# ============================================================
# Login
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user or not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.id, user.email)

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


# ============================================================
# Current User
# ============================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)