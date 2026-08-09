const API_URL =
  process.env.REACT_APP_API_URL || "";

/* =========================================================
   SUBMIT RSVP
========================================================= */

export async function submitRsvp(data) {
  const payload = {
    name: data?.name || "",

    attending:
      data?.attending === "yes"
        ? "yes"
        : "no",

    guests:
      data?.attending === "yes"
        ? Number(data?.guests || 0)
        : 0,

    message:
      data?.message || "",
  };

  console.log("RSVP DATA:", payload);

  try {
    const response = await fetch(
      `${API_URL}/rsvp`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.detail ||
        result?.error ||
        "Gabim gjatë dërgimit të RSVP."
      );
    }

    return {
      success: true,
      rsvp: result?.rsvp || null,
      seats: result?.seats || null,
    };

  } catch (error) {

    console.error(
      "submitRsvp ERROR:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}


/* =========================================================
   FETCH RSVPS
========================================================= */

export async function fetchRsvps() {

  try {

    const response =
      await fetch(
        `${API_URL}/rsvps`
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "fetchRsvps ERROR:",
      error
    );

    return [];
  }
}


/* =========================================================
   FETCH SEATS
========================================================= */

export async function fetchSeats() {

  try {

    const response =
      await fetch(
        `${API_URL}/seats`
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "fetchSeats ERROR:",
      error
    );

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
