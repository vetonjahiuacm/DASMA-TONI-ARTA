import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5lthul6";
const TEMPLATE_ID = "template_o8r5683";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  const templateParams = {
    // Emri i personit
    name: data?.name || "",

    // Statusi
    attending:
      data?.attending === "yes"
        ? "PO - Do të vij"
        : "JO - Nuk mund të vij",

    // Numri i personave
    guests:
      data?.attending === "yes"
        ? Number(data?.guests || 0)
        : 0,

    // Mesazhi
    message: data?.message || "",

    // Informacione shtesë për template-in
    event: "Ftesë Dasme Vetoni & Arta",
    date: "22.08.2026",
    time: "19:00",
    location: "RESTAURANT LATA",

    // Statistika
    total_seats: "80"
  };

  console.log("=================================");
  console.log("RSVP DATA:", templateParams);
  console.log("=================================");

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY
      }
    );

    console.log("=================================");
    console.log("EMAILJS SUCCESS:", result);
    console.log("=================================");

    return {
      success: true,
      seats: null
    };

  } catch (error) {
    console.error("=================================");
    console.error("EMAILJS ERROR:", error);
    console.error("=================================");

    return {
      success: false,
      error: error
    };
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
