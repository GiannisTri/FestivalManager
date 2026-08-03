import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Προσθήκη JWT σε κάθε request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");

    if (
      error.response?.status === 401 &&
      token &&
      !error.config.url.includes("/api/auth/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      
    }

    return Promise.reject(error);
  }
);

export default api;
