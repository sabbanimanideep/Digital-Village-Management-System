import axiosInstance from "../Services/axiosInstance";


const BASE = "/announcements";

// GET ALL
export const getAnnouncements = async () => {
  const { data } = await axiosInstance.get(BASE);
  return data;
};

// CREATE
export const createAnnouncement = async (payload) => {
  const { data } = await axiosInstance.post(BASE, payload);
  return data;
};

// UPDATE
export const updateAnnouncement = async (id, payload) => {
  const { data } = await axiosInstance.put(`${BASE}/${id}`, payload);
  return data;
};

// DELETE
export const deleteAnnouncement = async (id) => {
  const { data } = await axiosInstance.delete(`${BASE}/${id}`);
  return data;
};