import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "template_o8r5683";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

export async function submitRsvp(data) {
  const templateParams = {
    name: data?.name || "",
    attending:
      data?.attending === "yes"
        ? "PO - Do të vij"
        : "JO - Nuk mund të vij",
    guests:
      data?.attending === "yes"
        ? Number(data?.guests || 0)
        : 0,
    message: data?.message || "",
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("EmailJS SUCCESS:", response);

    return {
      success: true,
      seats: null,
    };
  } catch (error) {
    console.error("EmailJS ERROR:", error);

    return {
      success: false,
      error: error,
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
