import api from "../api/axios";

// 🔹 Signup
export const signup = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role || "user");
  }
  return res.data;
};

// 🔹 Login
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role || "user");
  }
  return res.data;
};

// 🔹 Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("view");
};
