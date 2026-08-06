// Mock data & local persistence for the wedding invitation (frontend-only for now)

export const eventData = {
  groom: "Vetoni",
  bride: "Arta",
  initials: "V & A",
  invitedBy: "Vetoni & Arta",
  dateHuman: "22 Gusht 2026",
  dateShort: "22.08.2026",
  dateISO: "2026-08-22T19:00:00",
  time: "19:00",
  weekday: "E Shtunë",
  venue: "Restaurant Lata",
  addressLine: "Restaurant Lata",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurant+Lata",
  mapsEmbed: "https://www.google.com/maps?q=Restaurant%20Lata&output=embed",
  quote:
    "Dashuria nuk shihet me sy, por me zemër. Na nderoni me praninë tuaj në ditën më të bukur të jetës sonë.",
  program: [
    { time: "19:00", label: "Pritja e mysafirëve" },
    { time: "19:30", label: "Ardhja e çiftit" },
    { time: "20:00", label: "Darka festive" },
    { time: "22:00", label: "Muzikë & vallëzim" },
  ],
};

const STORAGE_KEY = "va_rsvp_confirmations";

export const getRsvps = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addRsvp = (data) => {
  const list = getRsvps();
  const item = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return item;
};

export const clearRsvps = () => localStorage.removeItem(STORAGE_KEY);
