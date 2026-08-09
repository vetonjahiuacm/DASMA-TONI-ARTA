const nodemailer = require("nodemailer");

function clean(value, fallback = "") {
  return String(value ?? fallback)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildEmailHtml(rsvp, seats) {
  const name = clean(rsvp.name, "Pa emër");
  const attending = rsvp.attending === "yes";

  const status = attending
    ? "Do të jetë pranë jush"
    : "Nuk do të jetë pranë jush";

  const statusShort = attending
    ? "PO VIJNË"
    : "NUK VIJNË";

  const guests = attending
    ? num(rsvp.guests, 0)
    : 0;

  const message = clean(rsvp.message, "");

  const acceptedCount = num(seats.acceptedCount, 0);
  const declinedCount = num(seats.declinedCount, 0);
  const confirmedGuests = num(seats.confirmedGuests, guests);
  const total = num(seats.total, 80);
  const remaining = num(
    seats.remaining,
    Math.max(total - confirmedGuests, 0)
  );

  return `
<!doctype html>
<html lang="sq">

<head>
<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
</head>

<body style="
margin:0;
padding:0;
background:#eeeae1;
font-family:Georgia,'Times New Roman',serif;
color:#3c3833;
-webkit-text-size-adjust:100%;
">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="background:#eeeae1;">

<tr>
<td align="center" style="padding:30px 12px;">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
       max-width:820px;
       background:#ffffff;
       border:1px solid #ddd5c8;
       border-radius:28px;
       overflow:hidden;
       ">

<!-- HEADER -->

<tr>
<td style="
background:#292621;
padding:58px 25px 52px;
text-align:center;
color:#f7f3ea;
">

<div style="
font-size:13px;
letter-spacing:8px;
margin-bottom:24px;
color:#d6c39a;
">
FTESË DASME
</div>

<div style="
font-size:42px;
line-height:1.2;
margin-bottom:22px;
color:#f7f3ea;
">
Vetoni &amp; Arta
</div>

<div style="
font-size:16px;
letter-spacing:5px;
color:#ddd5c8;
">
22.08.2026
&nbsp;·&nbsp;
19:00
&nbsp;·&nbsp;
RESTAURANT LATA
</div>

</td>
</tr>


<!-- RESPONSE -->

<tr>
<td style="
padding:52px 30px 44px;
text-align:center;
border-bottom:1px solid #eee7db;
">

<div style="
font-size:25px;
line-height:1.5;
color:#4a443d;
margin-bottom:28px;
">

Keni pranuar një përgjigje të re për ftesën tuaj

</div>

<div style="
display:inline-block;
padding:14px 30px;
border:2px solid #d7e5cc;
border-radius:30px;
color:#718667;
font-family:Arial,sans-serif;
font-size:15px;
letter-spacing:5px;
">

${statusShort}

</div>

</td>
</tr>


<!-- DETAILS -->

<tr>
<td style="padding:0;">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0">

<tr>

<td style="
padding:22px 42px;
border-bottom:1px solid #eee7db;
font-size:15px;
letter-spacing:5px;
color:#9a9185;
">

EMRI

</td>

<td align="right"
style="
padding:22px 42px;
border-bottom:1px solid #eee7db;
font-size:27px;
color:#292621;
">

${name}

</td>

</tr>


<tr>

<td style="
padding:22px 42px;
border-bottom:1px solid #eee7db;
font-size:15px;
letter-spacing:5px;
color:#9a9185;
">

STATUSI

</td>

<td align="right"
style="
padding:22px 42px;
border-bottom:1px solid #eee7db;
font-size:21px;
color:#292621;
">

${status}

</td>

</tr>


<tr>

<td style="
padding:22px 42px;
font-size:15px;
letter-spacing:5px;
color:#9a9185;
">

NUMRI I PERSONAVE

</td>

<td align="right"
style="
padding:22px 42px;
font-size:24px;
color:#292621;
">

${guests}

</td>

</tr>

</table>

</td>
</tr>


<!-- MESSAGE -->

<tr>
<td style="
padding:24px 42px 30px;
">

<div style="
border:2px solid #eadfce;
border-radius:14px;
background:#fcfaf6;
padding:30px 32px;
">

<div style="
font-size:14px;
letter-spacing:4px;
color:#9a9185;
margin-bottom:18px;
">

MESAZHI PËR ÇIFTIN

</div>

<div style="
font-size:22px;
line-height:1.5;
font-style:italic;
color:#37322d;
">

“${message || "—"}”
<span style="font-style:normal;">❤️</span>

</div>

</div>

</td>
</tr>


<!-- STATISTICS -->

<tr>
<td style="padding:0 42px 28px;">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
       background:#292621;
       border-radius:16px;
       ">

<tr>

<td align="center"
    width="25%"
    style="padding:26px 5px 22px;">

<div style="
font-size:38px;
color:#d6bc7e;
">
${acceptedCount}
</div>

<div style="
font-size:11px;
letter-spacing:3px;
color:#ddd5c8;
">
PRANUAR
</div>

</td>


<td align="center"
    width="25%"
    style="padding:26px 5px 22px;">

<div style="
font-size:38px;
color:#d6bc7e;
">
${declinedCount}
</div>

<div style="
font-size:11px;
letter-spacing:3px;
color:#ddd5c8;
">
REFUZUAR
</div>

</td>


<td align="center"
    width="25%"
    style="padding:26px 5px 22px;">

<div style="
font-size:38px;
color:#d6bc7e;
">
${confirmedGuests}
</div>

<div style="
font-size:11px;
letter-spacing:3px;
color:#ddd5c8;
">
MYSAFIRË
</div>

</td>


<td align="center"
    width="25%"
    style="padding:26px 5px 22px;">

<div style="
font-size:38px;
color:#d6bc7e;
">
${remaining}
</div>

<div style="
font-size:11px;
letter-spacing:3px;
color:#ddd5c8;
">
VENDE LIRA
</div>

</td>

</tr>

</table>

</td>
</tr>


<!-- FOOTER -->

<tr>

<td style="
padding:12px 24px 30px;
text-align:center;
">

<p style="
margin:0;
color:#a89f90;
font-size:14px;
">

Vende të konfirmuara:
${confirmedGuests} / ${total}

</p>

<p style="
margin:12px 0 0;
color:#c9b382;
font-size:24px;
letter-spacing:5px;
">

V &amp; A

</p>

</td>

</tr>

</table>


<p style="
text-align:center;
color:#aaa294;
font-size:12px;
margin:18px 0 0;
">

Ky njoftim u dërgua automatikisht nga ftesa juaj online.

</p>

</td>
</tr>

</table>

</body>
</html>
`;
}


function setCors(res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
}


module.exports = async function handler(req, res) {

  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : (req.body || {});

    const rsvp = body.rsvp || body;
    const seats = body.seats || {};

    if (
      !rsvp.name ||
      !String(rsvp.name).trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Emri është i detyrueshëm"
      });
    }


    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD ||
      !process.env.NOTIFY_EMAIL
    ) {

      console.error(
        "SMTP environment variables are missing"
      );

      return res.status(500).json({
        success: false,
        error: "SMTP nuk është konfiguruar."
      });

    }


    const transporter =
      nodemailer.createTransport({

        host:
          process.env.SMTP_HOST ||
          "smtp.gmail.com",

        port:
          Number(
            process.env.SMTP_PORT || 587
          ),

        secure: false,

        requireTLS: true,

        auth: {
          user:
            process.env.SMTP_USER,

          pass:
            process.env.SMTP_PASSWORD
        }

      });


    const attending =
      rsvp.attending === "yes";


    const subject =
      `Konfirmim i ri – ${String(rsvp.name).trim()} ` +
      `(${attending ? "PO vijnë" : "JO nuk vijnë"})`;


    await transporter.sendMail({

      from:
        `"Ftesa Vetoni & Arta" <${process.env.SMTP_USER}>`,

      to:
        process.env.NOTIFY_EMAIL,

      subject,

      html:
        buildEmailHtml(
          rsvp,
          seats
        )

    });


    return res.status(200).json({
      success: true
    });


  } catch (error) {

    console.error(
      "SMTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Emaili nuk u dërgua."
    });

  }

};
