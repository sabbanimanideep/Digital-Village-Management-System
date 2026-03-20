import axios from "../Services/axiosInstance";

const API_BASE = "/announcements"; // adjust to match your backend

// Normalize any response shape into a plain array
const toArray = (data) => {
  if (Array.isArray(data))                 return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data))    return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

// Fetch all announcements visible to citizens
export const getAnnouncements = async () => {
  const response = await axios.get(API_BASE);
  return toArray(response.data);
};

// Fetch a single announcement by id
export const getAnnouncementById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};