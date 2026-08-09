import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5lthul6";
const TEMPLATE_ID = "__ejs-test-mail-service__";
const PUBLIC_KEY = "o0sDT0GCLXynbkP42";

export async function submitRsvp(data) {
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

    return { success: true };
  } catch (error) {
    console.error("EmailJS error:", error);
    return { success: false, error };
  }
}
