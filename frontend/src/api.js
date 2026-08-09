import emailjs from "@emailjs/browser";

// ======================================================
// CONFIGURATION
// ======================================================

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "_ejs-test-mail-service_";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

// Backend – përdoret vetëm për funksionet e tjera
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://vetoniartadasme.site";

const API = ${BACKEND_URL}/api;

// ======================================================
// RSVP – DËRGIMI I KONFIRMIMIT ME EMAILJS
// ======================================================

export async function submitRsvp(data) {
  try {
    if (!data) {
      throw new Error("Të dhënat e konfirmimit mungojnë.");
    }

    const templateParams = {
      name: data.name || "",
      attending: data.attending || "",
      guests: Number(data.guests) || 0,
      message: data.message || "",
    };

    console.log("Duke dërguar konfirmimin...", templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log("EmailJS response:", response);

    if (response.status === 200) {
      return {
        success: true,
        message: "Konfirmimi u dërgua me sukses.",
      };
    }

    return {
      success: false,
      message: "EmailJS nuk e konfirmoi dërgimin.",
    };
  } catch (error) {
    console.error("EmailJS error:", error);

    return {
      success: false,
      message:
        error?.text ||
        error?.message ||
        "Nuk u arrit të dërgohet konfirmimi.",
      error,
    };
  }
}

// ======================================================
// FETCH ALL RSVPS
// ======================================================

export async function fetchRsvps() {
  try {
    const response = await fetch(`${API}/rsvps`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("fetchRsvps error:", error);

    return [];
  }
}

// ======================================================
// FETCH SEATS
// ======================================================

export async function fetchSeats() {
  try {
    const response = await fetch(`${API}/seats`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("fetchSeats error:", error);

    return {
      total: 80,
      confirmedGuests: 0,
      remaining: 80,
      acceptedCount: 0,
      declinedCount: 0,
      totalResponses: 0,
    };
  }
}

// ======================================================
// OPTIONAL: TEST EMAIL
// ======================================================

export async function testEmail() {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: "TEST",
        attending: "Po, do të vij",
        guests: 1,
        message: "Ky është një test i EmailJS.",
      },
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log("Test email response:", response);

    return {
      success: response.status === 200,
      response,
    };
  } catch (error) {
    console.error("Test EmailJS error:", error);

    return {
      success: false,
      error,
    };
  }
}
