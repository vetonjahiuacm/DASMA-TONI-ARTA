from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Config
TOTAL_SEATS = int(os.environ.get('TOTAL_SEATS', '80'))
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'VETONJAHIUACM@GMAIL.COM')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', '').strip()

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------------- Models ----------------
class RsvpCreate(BaseModel):
    name: str
    attending: Literal["yes", "no"]
    guests: int = 0
    message: Optional[str] = ""


class Rsvp(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    attending: str
    guests: int = 0
    message: Optional[str] = ""
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Seats(BaseModel):
    total: int
    confirmedGuests: int
    remaining: int
    acceptedCount: int
    declinedCount: int
    totalResponses: int


# ---------------- Helpers ----------------
async def compute_seats() -> Seats:
    rsvps = await db.rsvps.find().to_list(2000)
    accepted = [r for r in rsvps if r.get("attending") == "yes"]
    declined = [r for r in rsvps if r.get("attending") == "no"]
    confirmed_guests = sum(int(r.get("guests") or 0) for r in accepted)
    remaining = max(0, TOTAL_SEATS - confirmed_guests)
    return Seats(
        total=TOTAL_SEATS,
        confirmedGuests=confirmed_guests,
        remaining=remaining,
        acceptedCount=len(accepted),
        declinedCount=len(declined),
        totalResponses=len(rsvps),
    )


def send_notification_email(rsvp: dict, seats: dict):
    """Send an RSVP notification via SendGrid. Fails silently (logs) if not configured."""
    if not SENDGRID_API_KEY or not SENDER_EMAIL:
        logger.warning("SendGrid not configured (missing SENDGRID_API_KEY / SENDER_EMAIL) - email skipped.")
        return
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail

        status_txt = "PO do të vijë" if rsvp.get("attending") == "yes" else "NUK do të vijë"
        guests = rsvp.get("guests") or 0
        msg = rsvp.get("message") or "-"
        html = f"""
        <div style="font-family:Georgia,serif;color:#2b2724;max-width:520px;margin:auto;">
          <h2 style="color:#b09a6b;">Konfirmim i ri – Vetoni &amp; Arta</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px;"><b>Emri</b></td><td style="padding:6px;">{rsvp.get('name')}</td></tr>
            <tr><td style="padding:6px;"><b>Statusi</b></td><td style="padding:6px;">{status_txt}</td></tr>
            <tr><td style="padding:6px;"><b>Nr. personave</b></td><td style="padding:6px;">{guests}</td></tr>
            <tr><td style="padding:6px;"><b>Mesazhi</b></td><td style="padding:6px;">{msg}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2dccf;"/>
          <p style="color:#5c554c;">
            Pranuar: <b>{seats.get('acceptedCount')}</b> &middot;
            Refuzuar: <b>{seats.get('declinedCount')}</b><br/>
            Persona të konfirmuar: <b>{seats.get('confirmedGuests')}</b> /
            {seats.get('total')} &middot; Vende të mbetura: <b>{seats.get('remaining')}</b>
          </p>
        </div>
        """
        mail = Mail(
            from_email=SENDER_EMAIL,
            to_emails=NOTIFY_EMAIL,
            subject=f"Konfirmim i ri – {rsvp.get('name')}",
            html_content=html,
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        resp = sg.send(mail)
        logger.info(f"SendGrid notification sent, status={resp.status_code}")
    except Exception as e:
        logger.error(f"Failed to send SendGrid email: {e}")


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Ftesa Vetoni & Arta API"}


@api_router.post("/rsvp")
async def create_rsvp(payload: RsvpCreate, background_tasks: BackgroundTasks):
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Emri është i detyrueshëm")
    rsvp = Rsvp(
        name=payload.name.strip(),
        attending=payload.attending,
        guests=payload.guests if payload.attending == "yes" else 0,
        message=(payload.message or "").strip(),
    )
    await db.rsvps.insert_one(rsvp.dict())
    seats = await compute_seats()
    # notify only when someone confirms attendance
    if rsvp.attending == "yes":
        background_tasks.add_task(send_notification_email, rsvp.dict(), seats.dict())
    else:
        background_tasks.add_task(send_notification_email, rsvp.dict(), seats.dict())
    return {"rsvp": rsvp.dict(), "seats": seats.dict()}


@api_router.get("/rsvps", response_model=List[Rsvp])
async def list_rsvps():
    rsvps = await db.rsvps.find().sort("createdAt", -1).to_list(2000)
    return [Rsvp(**r) for r in rsvps]


@api_router.get("/seats", response_model=Seats)
async def get_seats():
    return await compute_seats()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
