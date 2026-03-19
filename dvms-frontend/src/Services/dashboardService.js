import axiosInstance from "./axiosInstance";

// ✅ Get dashboard data
export const getDashboardData = async (name) => {
  try {
    const res = await axiosInstance.get(
      `/officer/dashboard?name=${name}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};