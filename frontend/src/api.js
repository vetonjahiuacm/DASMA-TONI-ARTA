import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "template_o8r5683";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  const templateParams = {
    name: data.name || "",
    attending:
      data.attending === "yes"
        ? "PO - DO TË VIJ"
        : "JO - NUK MUND TË VIJ",

    guests:
      data.attending === "yes"
        ? String(data.guests || 0)
        : "0",

    message: data.message || ""
  };

  console.log("EMAILJS PARAMS:", templateParams);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY
      }
    );

    console.log("EMAILJS SUCCESS:", response);

    return {
      success: true,
      seats: null
    };

  } catch (error) {
    console.error("EMAILJS ERROR:", error);

    throw new Error(
      error?.text ||
      error?.message ||
      "EmailJS nuk mundi ta dërgojë email-in."
    );
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
    confirmedGuests: 0,
    acceptedCount: 0,
    declinedCount: 0,
    totalResponses: 0
  };
}
