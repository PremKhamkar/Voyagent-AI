from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Feedback
from app.models.feedback import FeedbackCreate, FeedbackOut

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("", response_model=FeedbackOut, status_code=201)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
):
    feedback = Feedback(
        rating=feedback_data.rating,
        message=feedback_data.message.strip(),
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback