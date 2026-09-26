import re

from pydantic import BaseModel, Field, field_validator

# Same pattern the frontend already uses in Login.jsx/Register.jsx,
# kept in sync so client and server agree on what a valid email is.
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class RegisterRequest(BaseModel):

    name: str = Field(min_length=1, max_length=100)

    email: str

    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()

        if not EMAIL_PATTERN.match(value):
            raise ValueError("Please enter a valid email address.")

        return value

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return value.strip()


class LoginRequest(BaseModel):

    email: str

    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return value.strip().lower()


class UserResponse(BaseModel):

    id: int
    name: str
    email: str

    model_config = {
        "from_attributes": True,
    }


class TokenResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"
    user: UserResponse