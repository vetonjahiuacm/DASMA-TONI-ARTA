import axios from "axios";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://vetoniartadasme.site";

const API = BACKEND_URL + "/api";

export function submitRsvp(data) {
  return axios
    .post(API + "/rsvp", data)
    .then(function (response) {
      return response.data;
    });
}

export function fetchRsvps() {
  return axios
    .get(API + "/rsvps")
    .then(function (response) {
      return response.data;
    });
}

export function fetchSeats() {
  return axios
    .get(API + "/seats")
    .then(function (response) {
      return response.data;
    });
}
