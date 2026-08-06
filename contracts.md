# Contracts – Ftesa Vetoni & Arta

## Konfigurim
- TOTAL_SEATS = 80
- NOTIFY_EMAIL = VETONJAHIUACM@GMAIL.COM (marrësi i njoftimeve)
- SENDGRID_API_KEY, SENDER_EMAIL nga backend/.env (nëse mungon → email skip me elegancë, RSVP ruhet gjithsesi)

## Backend API (prefix /api)
- POST /api/rsvp
  - body: { name: str, attending: "yes"|"no", guests: int, message?: str }
  - ruaj në Mongo (collection `rsvps`), nëse attending=="yes" dërgo email njoftimi (BackgroundTask)
  - resp: { rsvp: {...}, seats: {...} }
- GET /api/rsvps  -> [ {id, name, attending, guests, message, createdAt} ]  (për /admin)
- GET /api/seats  -> { total, confirmedGuests, remaining, acceptedCount, declinedCount, totalResponses }

## Mocked më parë (zëvendësohet)
- mock.js: getRsvps/addRsvp (localStorage) -> tani thirrje reale në backend
- Gallery upload (localStorage) -> hiqet; fotot lexohen AUTOMATIK nga folderi `frontend/src/assets/gallery/` me `require.context`

## Integrimi Frontend
- RsvpForm -> POST /api/rsvp; pas suksesit shfaq mesazh + rifreskon seat count
- Invitation -> shfaq "Vende të mbetura: X / 80" nga GET /api/seats (rifreskohet pas RSVP)
- Admin (/admin) -> GET /api/rsvps + GET /api/seats
- Gallery -> auto import nga assets/gallery (pa buton ngarkimi)

## Email (SendGrid)
- Subject: "Konfirmim i ri – <emri>"
- Body (shqip): emri, statusi (Po vij / Nuk vij), nr personave, mesazhi, dhe totalet (pranuar/refuzuar/vende të mbetura)
- KUJDES: SENDER_EMAIL duhet të jetë "verified sender" në SendGrid.
