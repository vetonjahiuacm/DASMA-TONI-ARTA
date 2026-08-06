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

/* ---------- Photo gallery (frontend-only, stored as compressed base64) ---------- */
const PHOTOS_KEY = "va_gallery_photos";

export const getPhotos = () => {
  try {
    return JSON.parse(localStorage.getItem(PHOTOS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const savePhotos = (photos) =>
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));

export const removePhoto = (id) => {
  const next = getPhotos().filter((p) => p.id !== id);
  savePhotos(next);
  return next;
};

// Compress an uploaded image file to a small base64 JPEG (keeps localStorage light)
export const compressImage = (file, maxSize = 1200, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
