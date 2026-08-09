const API_URL =
  process.env.REACT_APP_API_URL ||
  "";

export async function submitRsvp(data) {
  try {
    const response = await fetch(`${API_URL}/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data?.name || "",
        attending: data?.attending || "yes",
        guests:
          data?.attending === "yes"
            ? Number(data?.guests || 0)
            : 0,
        message: data?.message || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Request failed: ${response.status}`
      );
    }

    const result = await response.json();

    return {
      success: true,
      rsvp: result.rsvp || null,
      seats: result.seats || null,
    };
  } catch (error) {
    console.error("RSVP ERROR:", error);

    return {
      success: false,
      error,
    };
  }
}

export async function fetchRsvps() {
  try {
    const response = await fetch(`${API_URL}/rsvps`);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("FETCH RSVPS ERROR:", error);
    return [];
  }
}

export async function fetchSeats() {
  try {
    const response = await fetch(`${API_URL}/seats`);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("FETCH SEATS ERROR:", error);

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
