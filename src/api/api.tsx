// @ts-ignore
import axios from "axios";



const api = axios.create({
  baseURL: "http://0.tcp.eu.ngrok.io:19460",
});
// console.log(localStorage.getItem("token"));
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log("Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const response = await api.post("/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("token", newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token error", refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
