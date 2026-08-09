import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://api.vetoniartadasme.site";
const API = BACKEND_URL + "/api";

export const submitRsvp = async (data) => {
  const res = await axios.post(API + "/rsvp", data);
  return res.data;
};

export const fetchRsvps = async () => {
  const res = await axios.get(API + "/rsvps");
  return res.data;
};

export const fetchSeats = async () => {
  const res = await axios.get(API + "/seats");
  return res.data;
};
