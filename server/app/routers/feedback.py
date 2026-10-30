from html import escape

from app.db.database import get_db
from app.db.models import Feedback
from app.models.feedback import FeedbackCreate, FeedbackOut
from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

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


@router.get("", response_class=HTMLResponse)
def get_feedback(db: Session = Depends(get_db)):
    feedback_list = db.query(Feedback).order_by(Feedback.id.desc()).all()

    cards = ""

    for item in feedback_list:
        stars = "★" * item.rating + "☆" * (5 - item.rating)

        cards += f"""
        <article class="card">
            <div class="stars">{stars}</div>
            <p>{escape(item.message)}</p>
            <small>Feedback ID: {item.id}</small>
        </article>
        """

    if not cards:
        cards = "<p>No customer feedback available yet.</p>"

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Voyagent AI - Customer Feedback</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background: #f1f5f9;
                margin: 0;
                padding: 40px 20px;
                color: #1e293b;
            }}
            main {{
                max-width: 800px;
                margin: auto;
            }}
            h1 {{ color: #4338ca; }}
            .card {{
                background: white;
                padding: 22px;
                margin: 16px 0;
                border-radius: 14px;
                box-shadow: 0 2px 8px #0000000d;
            }}
            .stars {{
                color: #f59e0b;
                font-size: 24px;
                letter-spacing: 3px;
            }}
            p {{ line-height: 1.7; }}
            small {{ color: #64748b; }}
        </style>
    </head>
    <body>
        <main>
            <h1>Voyagent AI — Customer Feedback</h1>
            <p>Feedback submitted by our travelers</p>
            {cards}
        </main>
    </body>
    </html>
    """
