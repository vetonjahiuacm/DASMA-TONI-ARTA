const RSVP_API_URL =
  "https://EMRI-YT.vercel.app/api/send-rsvp";


export async function submitRsvp(
  data,
  seats = {}
) {

  const payload = {

    rsvp: {

      name:
        data?.name || "",

      attending:
        data?.attending === "yes"
          ? "yes"
          : "no",

      guests:
        data?.attending === "yes"
          ? Number(data?.guests || 0)
          : 0,

      message:
        data?.message || ""

    },

    seats: {

      total:
        Number(seats?.total ?? 80),

      confirmedGuests:
        Number(
          seats?.confirmedGuests ?? 0
        ),

      remaining:
        Number(
          seats?.remaining ?? 80
        ),

      acceptedCount:
        Number(
          seats?.acceptedCount ?? 0
        ),

      declinedCount:
        Number(
          seats?.declinedCount ?? 0
        ),

      totalResponses:
        Number(
          seats?.totalResponses ?? 0
        )

    }

  };


  if (!payload.rsvp.name.trim()) {

    return {
      success: false,
      error: "Emri është i detyrueshëm"
    };

  }


  try {

    const response =
      await fetch(
        RSVP_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );


    const result =
      await response.json();


    if (
      !response.ok ||
      !result.success
    ) {

      throw new Error(
        result.error ||
        "Dërgimi dështoi"
      );

    }


    return {

      success: true,

      seats:
        seats || null

    };


  } catch (error) {

    console.error(
      "RSVP EMAIL ERROR:",
      error
    );


    return {

      success: false,

      error:
        error?.message ||
        "Nuk u dërgua emaili."

    };

  }

}
