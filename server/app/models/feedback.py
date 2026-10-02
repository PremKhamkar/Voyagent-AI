from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    message: str = Field(..., min_length=3, max_length=1000)


class FeedbackOut(BaseModel):
    id: int
    rating: int
    message: str

    class Config:
        from_attributes = True