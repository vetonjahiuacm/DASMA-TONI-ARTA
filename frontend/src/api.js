import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "_ejs-test-mail-service_";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  try {
    console.log("RSVP DATA:", data);

    const templateParams = {
      name: data?.name || "",
      attending: data?.attending || "",
      guests: data?.guests || 0,
      message: data?.message || "",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("EMAILJS SUCCESS:", response);

    return {
      success: true,
    };
  } catch (error) {
    console.error("EMAILJS ERROR:", error);

    return {
      success: false,
      error: error?.text  error?.message  "Email sending failed",
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
    totalResponses: 0,
  };
}
