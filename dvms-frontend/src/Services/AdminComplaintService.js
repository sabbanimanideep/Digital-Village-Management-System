import axios from "axios";

const API_BASE = "/api/complaints"; // adjust base URL to match your backend

// Normalize whatever shape the backend returns into a plain array
const toArray = (data) => {
  if (Array.isArray(data))                 return data;            // already an array
  if (data && Array.isArray(data.content)) return data.content;   // Spring Page object
  if (data && Array.isArray(data.data))    return data.data;      // { data: [] }
  if (data && Array.isArray(data.results)) return data.results;   // { results: [] }
  return [];
};

// Fetch all complaints
export const getComplaints = async () => {
  const response = await axios.get(API_BASE);
  return toArray(response.data);
};

// Fetch complaints filtered by status (e.g. "PENDING", "IN_PROGRESS", "RESOLVED")
export const getComplaintsByStatus = async (status) => {
  const response = await axios.get(`${API_BASE}/status/${status}`);
  return toArray(response.data);
};

// Update the status of a single complaint by id
export const updateComplaintStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE}/${id}/status`, { status });
  return response.data;
};