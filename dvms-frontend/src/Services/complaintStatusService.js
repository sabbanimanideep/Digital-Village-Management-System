import axiosInstance from "./axiosInstance";

// ✅ Get all complaints
export const getAllComplaints = async () => {
  const res = await axiosInstance.get("/officer/complaints");
  return res.data;
};

// ✅ Filter by status
export const getComplaintsByStatus = async (status) => {
  const res = await axiosInstance.get(
    `/officer/complaints/status/${status}`
  );
  return res.data;
};

// ✅ Update status
export const updateComplaintStatus = async (id, status) => {
  const res = await axiosInstance.put(
    `/officer/complaints/${id}/status?status=${status}`
  );
  return res.data;
};