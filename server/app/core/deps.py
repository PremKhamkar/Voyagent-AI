"""
Reusable FastAPI dependencies for authenticated endpoints.

Not wired into any endpoint yet — /generate-trip, /chat, etc. remain
open for now. This is introduced so that the upcoming /trips endpoints
(and any endpoint we later decide to protect) can just add
`user: User = Depends(get_current_user)` to their signature.
"""

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.database import get_db
from app.db.models import User

# `auto_error=False` so we can return our own 401 message instead of
# FastAPI's generic one when the header is missing entirely.
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Reads the `Authorization: Bearer <token>` header, verifies it, and
    returns the matching User row. Raises 401 for any failure (missing
    header, invalid token, expired token, or a user id that no longer
    exists).
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise unauthorized

    user_id = payload.get("sub")
    if user_id is None:
        raise unauthorized

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise unauthorized

    return user
