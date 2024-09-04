// @ts-ignore
import axios from "axios";

export const config = {
  baseURL: "https://facial-attendance-nsr7.onrender.com",
};

const client = axios.create({
  baseURL: config.baseURL,

  timeout: 100000,
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export default client;
