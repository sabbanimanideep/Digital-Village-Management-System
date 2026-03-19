import axiosInstance from "./axiosInstance";

// ✅ Get all schemes
export const getAllSchemes = async () => {
  try {
    const response = await axiosInstance.get("/schemes");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ✅ Add new scheme (Admin)
export const addScheme = async (schemeData) => {
  try {
    const response = await axiosInstance.post("/schemes", schemeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};