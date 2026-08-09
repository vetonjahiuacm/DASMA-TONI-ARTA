import os
import html as html_escape
import logging
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header

from fastapi import BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


# ============================================================
# EMAIL CONFIG
# ============================================================

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()

NOTIFY_EMAIL = os.getenv(
    "NOTIFY_EMAIL",
    SMTP_USER
).strip()


# ============================================================
# EMAIL HTML
# ============================================================

def _build_email_html(rsvp: dict, seats: dict) -> str:

    name = html_escape.escape(
        str(rsvp.get("name") or "")
    )

    message = html_escape.escape(
        str(rsvp.get("message") or "")
    )

    attending = rsvp.get("attending")

    guests = int(
        rsvp.get("guests") or 0
    )

    if attending == "yes":
        status_text = "Do të jetë pranë jush"
        status_short = "PO VIJNË"
        status_bg = "#eef5e8"
        status_border = "#d7e5c8"
        status_color = "#71865f"
    else:
        status_text = "Nuk mund të jetë pranë jush"
        status_short = "NUK VIJNË"
        status_bg = "#f7eeee"
        status_border = "#ead2d2"
        status_color = "#9a6f6f"

    accepted = int(
        seats.get("acceptedCount") or 0
    )

    declined = int(
        seats.get("declinedCount") or 0
    )

    total_guests = int(
        seats.get("confirmedGuests") or 0
    )

    total_seats = int(
        seats.get("total") or 80
    )

    remaining = int(
        seats.get("remaining") or max(
            total_seats - total_guests,
            0
        )
    )

    # Nëse nuk ka mesazh
    if not message:
        message = "Nuk është dhënë mesazh."

    return f"""
<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ftesa për Dasme Vetoni &amp; Arta</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#eeeae1;
    font-family:Georgia,'Times New Roman',serif;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        background:#eeeae1;
        margin:0;
        padding:0;
    "
>
<tr>
<td align="center" style="padding:20px 10px 30px;">

<table
    width="820"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        max-width:820px;
        background:#ffffff;
        border-radius:28px;
        overflow:hidden;
        border:1px solid #ddd5c8;
    "
>

<!-- ======================================================
     HEADER
====================================================== -->

<tr>
<td
    align="center"
    style="
        background:#292621;
        padding:55px 25px 50px;
        color:#f7f3ea;
    "
>

<div style="
    font-size:13px;
    letter-spacing:8px;
    margin-bottom:20px;
    color:#d6c39a;
">
    FTESË DASME
</div>

<div style="
    font-size:42px;
    line-height:1.2;
    margin-bottom:22px;
    color:#ffffff;
">
    Vetoni &amp; Arta
</div>

<div style="
    font-size:16px;
    letter-spacing:5px;
    color:#ddd5c8;
">
    22.08.2026 &nbsp;·&nbsp; 19:00 &nbsp;·&nbsp; RESTAURANT LATA
</div>

</td>
</tr>


<!-- ======================================================
     NEW RSVP
====================================================== -->

<tr>
<td
    align="center"
    style="
        padding:48px 25px 42px;
        background:#ffffff;
        border-bottom:1px solid #eee5d8;
    "
>

<div style="
    font-size:25px;
    line-height:1.5;
    color:#514b43;
    margin-bottom:25px;
">
    Keni pranuar një përgjigje të re për ftesën tuaj
</div>

<div style="
    display:inline-block;
    padding:13px 34px;
    border-radius:40px;
    background:{status_bg};
    border:2px solid {status_border};
    color:{status_color};
    font-size:15px;
    letter-spacing:5px;
">
    {status_short}
</div>

</td>
</tr>


<!-- ======================================================
     NAME
====================================================== -->

<tr>
<td style="
    padding:25px 52px;
    border-bottom:1px solid #eee5d8;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<td style="
    color:#9b9285;
    font-size:14px;
    letter-spacing:5px;
">
    EMRI
</td>

<td align="right" style="
    color:#2d2925;
    font-size:25px;
">
    {name}
</td>

</tr>
</table>

</td>
</tr>


<!-- ======================================================
     STATUS
====================================================== -->

<tr>
<td style="
    padding:25px 52px;
    border-bottom:1px solid #eee5d8;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<td style="
    color:#9b9285;
    font-size:14px;
    letter-spacing:5px;
">
    STATUSI
</td>

<td align="right" style="
    color:#2d2925;
    font-size:20px;
">
    {status_text}
</td>

</tr>
</table>

</td>
</tr>


<!-- ======================================================
     GUESTS
====================================================== -->

<tr>
<td style="
    padding:25px 52px 30px;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<td style="
    color:#9b9285;
    font-size:14px;
    letter-spacing:5px;
">
    NUMRI I PERSONAVE
</td>

<td align="right" style="
    color:#2d2925;
    font-size:25px;
">
    {guests}
</td>

</tr>
</table>

</td>
</tr>


<!-- ======================================================
     MESSAGE
====================================================== -->

<tr>
<td style="
    padding:0 52px 30px;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#faf8f3;
        border:2px solid #eadfcd;
        border-radius:16px;
    "
>

<tr>
<td style="
    padding:30px 35px;
">

<div style="
    color:#9b9285;
    font-size:13px;
    letter-spacing:5px;
    margin-bottom:18px;
">
    MESAZHI PËR ÇIFTIN
</div>

<div style="
    color:#3e3933;
    font-size:22px;
    line-height:1.5;
    font-style:italic;
">
    “{message}”
    <span style="font-style:normal;">❤️</span>
</div>

</td>
</tr>

</table>

</td>
</tr>


<!-- ======================================================
     STATISTICS
====================================================== -->

<tr>
<td style="
    padding:0 52px 30px;
">

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#292621;
        border-radius:16px;
        overflow:hidden;
    "
>

<tr>

<td
    width="25%"
    align="center"
    style="
        padding:28px 5px;
        color:#c9b382;
    "
>
<div style="
    font-size:38px;
    line-height:1;
    margin-bottom:8px;
">
    {accepted}
</div>

<div style="
    font-size:11px;
    letter-spacing:3px;
    color:#e2d8c8;
">
    PRANUAR
</div>
</td>


<td
    width="25%"
    align="center"
    style="
        padding:28px 5px;
        color:#c9b382;
    "
>
<div style="
    font-size:38px;
    line-height:1;
    margin-bottom:8px;
">
    {declined}
</div>

<div style="
    font-size:11px;
    letter-spacing:3px;
    color:#e2d8c8;
">
    REFUZUAR
</div>
</td>


<td
    width="25%"
    align="center"
    style="
        padding:28px 5px;
        color:#c9b382;
    "
>
<div style="
    font-size:38px;
    line-height:1;
    margin-bottom:8px;
">
    {total_guests}
</div>

<div style="
    font-size:11px;
    letter-spacing:3px;
    color:#e2d8c8;
">
    MYSAFIRË
</div>
</td>


<td
    width="25%"
    align="center"
    style="
        padding:28px 5px;
        color:#c9b382;
    "
>
<div style="
    font-size:38px;
    line-height:1;
    margin-bottom:8px;
">
    {remaining}
</div>

<div style="
    font-size:11px;
    letter-spacing:3px;
    color:#e2d8c8;
">
    VENDE LIRA
</div>
</td>

</tr>
</table>

</td>
</tr>


<!-- ======================================================
     FOOTER
====================================================== -->

<tr>
<td align="center" style="
    padding:20px 24px 26px;
">

<div style="
    color:#a89f90;
    font-size:14px;
">
    Vende të konfirmuara:
    {total_guests} / {total_seats}
</div>

<div style="
    margin-top:12px;
    color:#c9b382;
    font-size:26px;
    letter-spacing:4px;
">
    V &amp; A
</div>

</td>
</tr>

</table>


<!-- BOTTOM TEXT -->

<div style="
    max-width:820px;
    text-align:center;
    color:#b0a89a;
    font-size:12px;
    line-height:1.5;
    margin-top:18px;
">
    Ky njoftim u dërgua automatikisht nga ftesa juaj online.
</div>

</td>
</tr>
</table>

</body>
</html>
"""


# ============================================================
# SMTP SENDER
# ============================================================

def _send_via_smtp(subject: str, html: str) -> bool:

    if not SMTP_USER:
        logger.error("SMTP_USER nuk është konfiguruar.")
        return False

    if not SMTP_PASSWORD:
        logger.error("SMTP_PASSWORD nuk është konfiguruar.")
        return False

    if not NOTIFY_EMAIL:
        logger.error("NOTIFY_EMAIL nuk është konfiguruar.")
        return False

    message = MIMEMultipart("alternative")

    message["Subject"] = str(
        Header(subject, "utf-8")
    )

    message["From"] = (
        f"Ftesa Vetoni & Arta <{SMTP_USER}>"
    )

    message["To"] = NOTIFY_EMAIL

    message.attach(
        MIMEText(
            html,
            "html",
            "utf-8"
        )
    )

    try:

        logger.info(
            f"SMTP: connecting to {SMTP_HOST}:{SMTP_PORT}"
        )

        with smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=30
        ) as server:

            server.ehlo()

            server.starttls()

            server.ehlo()

            logger.info(
                "SMTP TLS connection established."
            )

            server.login(
                SMTP_USER,
                SMTP_PASSWORD
            )

            logger.info(
                "SMTP authentication successful."
            )

            server.sendmail(
                SMTP_USER,
                [NOTIFY_EMAIL],
                message.as_string()
            )

            logger.info(
                f"RSVP email successfully sent to {NOTIFY_EMAIL}"
            )

        return True

    except Exception as e:

        logger.exception(
            f"SMTP email failed: {e}"
        )

        return False


# ============================================================
# SEND RSVP NOTIFICATION
# ============================================================

def send_notification_email(
    rsvp: dict,
    seats: dict
):

    attending = (
        rsvp.get("attending") == "yes"
    )

    status = (
        "PO vijn"
        if attending
        else
        "nuk vijn"
    )

    name = (
        rsvp.get("name")
        or
        "Pa emër"
    )

    subject = (
        f"Konfirmim i ri – {name} ({status})"
    )

    html = _build_email_html(
        rsvp,
        seats
    )

    try:

        success = _send_via_smtp(
            subject,
            html
        )

        if success:

            logger.info(
                "================================================"
            )

            logger.info(
                "RSVP EMAIL SENT SUCCESSFULLY"
            )

            logger.info(
                f"Guest: {name}"
            )

            logger.info(
                f"To: {NOTIFY_EMAIL}"
            )

            logger.info(
                "================================================"
            )

        else:

            logger.error(
                "RSVP email was NOT sent."
            )

    except Exception as e:

        logger.exception(
            f"Unexpected email error: {e}"
        )
