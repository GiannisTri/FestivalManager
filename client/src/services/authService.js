import api from "./api";

const login = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getToken = () => {
  return localStorage.getItem("token");
};

const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default {
  login,
  logout,
  getToken,
  getUser,
  isAuthenticated,
};