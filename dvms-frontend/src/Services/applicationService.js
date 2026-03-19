import axiosInstance from "./axiosInstance";

// ✅ Apply for scheme
export const applyForScheme = async (email, schemeId) => {
  try {
    const response = await axiosInstance.post(
      `/applications/apply?email=${email}&schemeId=${schemeId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ✅ Get user applications
export const getUserApplications = async (email) => {
  try {
    const response = await axiosInstance.get(
      `/applications?email=${email}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};