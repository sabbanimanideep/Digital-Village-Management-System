import axiosInstance from "../Services/axiosInstance";

const BASE = "/users";

// GET all users
export const getUsers = async () => {
  const { data } = await axiosInstance.get(BASE);
  return data;
};

// FILTER by role
export const getUsersByRole = async (role) => {
  const { data } = await axiosInstance.get(`${BASE}/role/${role}`);
  return data;
};

// ADD user
export const addUser = async (payload) => {
  const { data } = await axiosInstance.post(BASE, payload);
  return data;
};

// UPDATE user
export const updateUser = async (id, payload) => {
  const { data } = await axiosInstance.put(`${BASE}/${id}`, payload);
  return data;
};

// DELETE user
export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`${BASE}/${id}`);
  return data;
};