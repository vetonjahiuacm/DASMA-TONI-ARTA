import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "template_o8r5683";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  const attending =
    data.attending === "yes"
      ? "PO VJIN"
      : "NUK MUND TË VIJ";

  const guests =
    data.attending === "yes"
      ? Number(data.guests || 0)
      : 0;

  const templateParams = {
    name: data.name || "",
    attending: attending,

    status_text:
      data.attending === "yes"
        ? "Do të jetë pranë jush"
        : "Nuk mund të jetë pranë jush",

    guests: guests,

    message: data.message || "",

    // Nëse këto vlera vijnë nga backend-i,
    // mund t'i zëvendësosh më vonë.
    acceptedCount: data.acceptedCount ?? 0,
    declinedCount: data.declinedCount ?? 0,
    confirmedGuests: data.confirmedGuests ?? guests,
    remaining: data.remaining ?? Math.max(0, 80 - guests)
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("EmailJS SUCCESS:", result);

    return {
      success: true,
      seats: null
    };
  } catch (error) {
    console.error("EmailJS ERROR:", error);
    throw error;
  }
}

export async function fetchRsvps() {
  return [];
}

export async function fetchSeats() {
  return {
    total: 80,
    confirmedGuests: 0,
    remaining: 80,
    acceptedCount: 0,
    declinedCount: 0,
    totalResponses: 0
  };
}
