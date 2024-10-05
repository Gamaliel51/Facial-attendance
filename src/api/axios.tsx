// @ts-ignore
import axios from "axios";

export const config = {
  baseURL: "http://0.tcp.eu.ngrok.io:19460",
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
