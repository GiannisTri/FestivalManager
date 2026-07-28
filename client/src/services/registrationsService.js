import api from "./api";

const mapRegistration = (registration) => ({
  id: registration.id,
  vendorId: registration.vendor_id,
  vendorName: registration.vendor_name,
  year: registration.year,
  createdAt: registration.created_at,
});

const getAllRegistrations = async () => {
  const response = await api.get("/registrations");
  return response.data.map(mapRegistration);
};

const getRegistrationById = async (id) => {
  const response = await api.get(`/registrations/${id}`);
  return mapRegistration(response.data);
};

const createRegistration = async (registration) => {
  const response = await api.post("/registrations", {
    vendor_id: registration.vendorId,
    year: registration.year,
  });

  return mapRegistration(response.data);
};

const updateRegistration = async (id, registration) => {
  const response = await api.put(`/registrations/${id}`, {
    vendor_id: registration.vendorId,
    year: registration.year,
  });

  return mapRegistration(response.data);
};

const deleteRegistration = async (id) => {
  const response = await api.delete(`/registrations/${id}`);
  return response.data;
};

export default {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
};