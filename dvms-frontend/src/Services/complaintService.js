import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8089/api",
});

// 🔹 Submit complaint
export const submitComplaint = async (data) => {
  const response = await API.post("/complaints", data);
  return response.data;
};

// 🔹 Get complaints
export const getComplaints = async (email) => {
  const response = await API.get(`/complaints?email=${email}`);
  return response.data;
};