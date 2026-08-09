import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "_ejs-test-mail-service_";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  try {
    const templateParams = {
      name: data.name || "",
      attending: data.attending || "",
      guests: data.guests || 0,
      message: data.message || ""
    };

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return {
      success: true
    };
  } catch (error) {
    console.error("EmailJS error:", error);

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
