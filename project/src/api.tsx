import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

// Function to log in and store JWT token
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Function to get the stored JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Function to make authenticated API requests
export const apiRequest = async (endpoint: string, method: string = "GET", data: any = null) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios({ url: `${API_URL}${endpoint}`, method, headers, data });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "API request failed" };
  }
};
