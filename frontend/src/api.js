import axios from "axios";
import emailjs from "@emailjs/browser";

// ===============================
// BACKEND
// ===============================

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://vetoniartadasme.site";

const API = BACKEND_URL + "/api";

// ===============================
// EMAILJS
// ===============================

const SERVICE_ID = "service_5ithul6";
const TEMPLATE_ID = "_ejs-test-mail-service_";
const PUBLIC_KEY = "o0sDT0GCLxynbkP42";

// ===============================
// RSVP - SAVE + EMAIL
// ===============================

export async function submitRsvp(data) {
  // 1. Ruaje RSVP në backend
  const response = await axios.post(API + "/rsvp", data);

  // 2. Dërgo email përmes EmailJS
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: data.name || "",
        attending: data.attending || "",
        guests: data.guests || 0,
        message: data.message || "",
      },
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log("EmailJS: email sent successfully");
  } catch (error) {
    console.error("EmailJS error:", error);
  }

  return response.data;
}

// ===============================
// GET ALL RSVPS
// ===============================

export function fetchRsvps() {
  return axios
    .get(API + "/rsvps")
    .then(function (response) {
      return response.data;
    });
}

// ===============================
// GET SEATS
// ===============================

export function fetchSeats() {
  return axios
    .get(API + "/seats")
    .then(function (response) {
      return response.data;
    });
}
