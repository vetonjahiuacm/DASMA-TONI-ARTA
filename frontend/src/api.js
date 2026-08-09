import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL + "/api";

export const submitRsvp = async (data) => {
  const response = await axios.post(API + "/rsvp", data);
  return response.data;
};

export const fetchRsvps = async () => {
  const response = await axios.get(API + "/rsvps");
  return response.data;
};

export const fetchSeats = async () => {
  const response = await axios.get(API + "/seats");
  return response.data;
};
