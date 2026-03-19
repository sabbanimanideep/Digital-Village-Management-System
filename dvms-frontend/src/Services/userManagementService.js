import axiosInstance from "./axiosInstance";

// ✅ Fetch villagers + complaint count
export const getVillagersWithComplaints = async () => {
  try {
    const response = await axiosInstance.get(
      "/users/villagers-with-complaints"
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};