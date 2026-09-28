"""
Password hashing and JWT access-token handling.

Uses `bcrypt` directly (not passlib) — passlib's bcrypt backend has a
known incompatibility with bcrypt>=4.1 (AttributeError: module 'bcrypt'
has no attribute '__about__'), and we don't need passlib's extra
abstraction for a single hashing scheme.
"""

import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "10080"))  # 7 days


def hash_password(password: str) -> str:
    """Hash a plaintext password for storage. Never store the raw password."""
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Check a plaintext password against a stored bcrypt hash."""
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )


def create_access_token(user_id: int, email: str) -> str:
    """
    Create a signed JWT for a logged-in user. The token carries the
    user's id (`sub`) and email, plus an expiry.
    """
    if not JWT_SECRET:
        raise RuntimeError(
            "JWT_SECRET is not set. Add JWT_SECRET=<a long random string> "
            "to server/.env before issuing tokens."
        )

    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode and verify a JWT. Raises jwt.PyJWTError (or a subclass, e.g.
    jwt.ExpiredSignatureError, jwt.InvalidTokenError) if the token is
    invalid or expired — callers should catch this and turn it into a
    401 response.
    """
    if not JWT_SECRET:
        raise RuntimeError(
            "JWT_SECRET is not set. Add JWT_SECRET=<a long random string> "
            "to server/.env before verifying tokens."
        )

    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
