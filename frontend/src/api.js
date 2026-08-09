import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "template_o8r5683";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  const templateParams = {
    name: String(data?.name || ""),
    attending:
      data?.attending === "yes"
        ? "PO - Do të vij"
        : "JO - Nuk mund të vij",
    guests:
      data?.attending === "yes"
        ? Number(data?.guests || 0)
        : 0,
    message: String(data?.message || ""),
  };

  console.log("EMAILJS PARAMS:", templateParams);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log(
      "EMAILJS SUCCESS:",
      response.status,
      response.text
    );

    return {
      success: true,
      seats: null,
    };
  } catch (error) {
    console.error("EMAILJS FAILED:", error);
    console.error("EMAILJS ERROR TEXT:", error?.text);
    console.error("EMAILJS ERROR STATUS:", error?.status);

    throw new Error(
      error?.text ||
      EmailJS error ${error?.status || "unknown"}
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
    acceptedCount: 0,
    declinedCount: 0,
    totalResponses: 0,
  };
}
