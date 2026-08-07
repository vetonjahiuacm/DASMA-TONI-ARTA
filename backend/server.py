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
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', 'vetonjahiuacm@gmail.com')
# SendGrid (optional)
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', '').strip()
# Gmail / generic SMTP (optional, preferred if configured)
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com').strip()
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '').strip()
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '').strip()

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


def _build_email_html(rsvp: dict, seats: dict) -> str:
    is_yes = rsvp.get("attending") == "yes"
    status_txt = "Do të jetë pranë jush" if is_yes else "Nuk do të mund të vijë"
    badge_bg = "#eef3e9" if is_yes else "#f5ecec"
    badge_bd = "#cfe0c4" if is_yes else "#e6cccc"
    badge_fg = "#5b7a4f" if is_yes else "#9a5b5b"
    badge_lbl = "PO VIJN" if is_yes else "NUK VIJN"
    guests = rsvp.get("guests") or 0
    msg = (rsvp.get("message") or "").strip()
    name = rsvp.get("name", "")

    guests_row = ""
    if is_yes:
        guests_row = f"""
            <tr>
              <td style="padding:12px 24px;color:#8a8175;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Numri i personave</td>
              <td style="padding:12px 24px;color:#2b2724;font-size:18px;font-family:Georgia,serif;text-align:right;">{guests}</td>
            </tr>"""

    message_block = ""
    if msg:
        message_block = f"""
          <div style="margin:0 24px 8px;padding:18px 20px;background:#faf8f3;border:1px solid #eadfce;border-radius:6px;">
            <p style="margin:0 0 6px;color:#8a8175;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mesazhi për çiftin</p>
            <p style="margin:0;color:#2b2724;font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.5;">&ldquo;{msg}&rdquo;</p>
          </div>"""

    return f"""<!DOCTYPE html>
<html lang="sq">
  <body style="margin:0;padding:0;background:#efece4;">
    <div style="max-width:560px;margin:0 auto;padding:28px 12px;font-family:Georgia,'Times New Roman',serif;">
      <div style="background:#ffffff;border:1px solid #e6dfce;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px -12px rgba(120,100,60,0.25);">
        <!-- header -->
        <div style="background:linear-gradient(135deg,#2b2724,#3a352e);padding:34px 24px;text-align:center;">
          <p style="margin:0;color:#c9b382;font-size:11px;letter-spacing:5px;text-transform:uppercase;">Ftesë Dasme</p>
          <h1 style="margin:8px 0 0;color:#f4efe4;font-size:34px;font-weight:normal;letter-spacing:1px;">Vetoni &amp; Arta</h1>
          <p style="margin:8px 0 0;color:#b7ad9c;font-size:13px;letter-spacing:3px;">22.08.2026 &middot; 19:00 &middot; RESTAURANT LATA</p>
        </div>

        <!-- intro -->
        <div style="padding:26px 24px 6px;text-align:center;">
          <p style="margin:0;color:#5c554c;font-size:16px;">Keni pranuar një përgjigje të re për ftesën tuaj</p>
          <div style="display:inline-block;margin-top:14px;padding:7px 18px;border-radius:999px;background:{badge_bg};border:1px solid {badge_bd};color:{badge_fg};font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;">{badge_lbl}</div>
        </div>

        <!-- details -->
        <table style="width:100%;border-collapse:collapse;margin-top:14px;">
          <tr>
            <td style="padding:12px 24px;color:#8a8175;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #f0e9db;">Emri</td>
            <td style="padding:12px 24px;color:#2b2724;font-size:20px;font-family:Georgia,serif;text-align:right;border-top:1px solid #f0e9db;">{name}</td>
          </tr>
          <tr>
            <td style="padding:12px 24px;color:#8a8175;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #f0e9db;">Statusi</td>
            <td style="padding:12px 24px;color:#2b2724;font-size:16px;font-family:Georgia,serif;text-align:right;border-top:1px solid #f0e9db;">{status_txt}</td>
          </tr>
          {guests_row}
        </table>

        <div style="height:14px;"></div>
        {message_block}

        <!-- summary -->
        <div style="margin:14px 24px 6px;padding:18px 20px;background:#2b2724;border-radius:8px;color:#f4efe4;">
          <table style="width:100%;border-collapse:collapse;text-align:center;">
            <tr>
              <td style="padding:4px;">
                <div style="font-size:26px;font-family:Georgia,serif;color:#c9b382;">{seats.get('acceptedCount')}</div>
                <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#b7ad9c;">Pranuar</div>
              </td>
              <td style="padding:4px;">
                <div style="font-size:26px;font-family:Georgia,serif;color:#c9b382;">{seats.get('declinedCount')}</div>
                <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#b7ad9c;">Refuzuar</div>
              </td>
              <td style="padding:4px;">
                <div style="font-size:26px;font-family:Georgia,serif;color:#c9b382;">{seats.get('confirmedGuests')}</div>
                <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#b7ad9c;">Mysafirë</div>
              </td>
              <td style="padding:4px;">
                <div style="font-size:26px;font-family:Georgia,serif;color:#c9b382;">{seats.get('remaining')}</div>
                <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#b7ad9c;">Vende Lira</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- footer -->
        <div style="padding:20px 24px 26px;text-align:center;">
          <p style="margin:0;color:#a89f90;font-size:12px;">Vende të konfirmuara: {seats.get('confirmedGuests')} / {seats.get('total')}</p>
          <p style="margin:10px 0 0;color:#c9b382;font-size:20px;font-family:Georgia,serif;">V &amp; A</p>
        </div>
      </div>
      <p style="text-align:center;color:#b0a89a;font-size:11px;margin:16px 0 0;">Ky njoftim u dërgua automatikisht nga ftesa juaj online.</p>
    </div>
  </body>
</html>"""


def _send_via_smtp(subject: str, html: str) -> bool:
    if not SMTP_USER or not SMTP_PASSWORD:
        return False
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"Ftesa Vetoni & Arta <{SMTP_USER}>"
    message["To"] = NOTIFY_EMAIL
    message.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, [NOTIFY_EMAIL], message.as_string())
    return True


def _send_via_sendgrid(subject: str, html: str) -> bool:
    if not SENDGRID_API_KEY or not SENDER_EMAIL:
        return False
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail

    mail = Mail(from_email=SENDER_EMAIL, to_emails=NOTIFY_EMAIL, subject=subject, html_content=html)
    resp = SendGridAPIClient(SENDGRID_API_KEY).send(mail)
    return resp.status_code in (200, 201, 202)


def send_notification_email(rsvp: dict, seats: dict):
    """Send a professional RSVP notification. Prefers SMTP, falls back to SendGrid. Fails gracefully."""
    subject = f"Konfirmim i ri – {rsvp.get('name')} ({'PO vijn' if rsvp.get('attending') == 'yes' else 'nuk vijn'})"
    html = _build_email_html(rsvp, seats)
    try:
        if _send_via_smtp(subject, html):
            logger.info("RSVP notification sent via SMTP.")
            return
        if _send_via_sendgrid(subject, html):
            logger.info("RSVP notification sent via SendGrid.")
            return
        logger.warning("No email transport configured (SMTP/SendGrid) - email skipped, RSVP still saved.")
    except Exception as e:
        logger.error(f"Failed to send notification email: {e}")


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
    # notify the couple by email for every response (accept or decline)
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
