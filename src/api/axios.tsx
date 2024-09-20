// @ts-ignore
import axios from "axios";

export const config = {
  baseURL: "https://attendify-gacdcsgchfc4ama9.canadacentral-01.azurewebsites.net",
};

const client = axios.create({
  baseURL: config.baseURL,

  timeout: 500000,
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

export default client;
