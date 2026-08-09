import emailjs from "@emailjs/browser";

// EmailJS configuration
const SERVICE_ID = "service_5lthul6";
const TEMPLATE_ID = "__ejs-test-mail-service__";
const PUBLIC_KEY = "o0sDT0GCLXynbkP42";

export const submitRsvp = async (data) => {
  try {
    const templateParams = {
      name: data.name || "",
      attending: data.attending || "",
      guests: data.guests || 0,
      message: data.message || "",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log("RSVP email sent:", response.status, response.text);

    return {
      success: true,
      message: "Konfirmimi u dërgua me sukses!",
    };
  } catch (error) {
    console.error("RSVP email error:", error);

    throw new Error(
      "Nuk u dërgua konfirmimi. Ju lutemi provoni përsëri."
    );
  }
};

export const fetchRsvps = async () => {
  return [];
};

export const fetchSeats = async () => {
  return {
    total: 80,
    confirmedGuests: 0,
    remaining: 80,
    acceptedCount: 0,
    declinedCount: 0,
    totalResponses: 0,
  };
};
