import api from "./api";

const mapVendorToFrontend = (vendor) => ({
  id: vendor.id,
  firstName: vendor.first_name,
  lastName: vendor.last_name,
  phone: vendor.phone,
  email: vendor.email,
});

const mapVendorToBackend = (vendor) => ({
  first_name: vendor.firstName,
  last_name: vendor.lastName,
  phone: vendor.phone,
  email: vendor.email,
});

const getAllVendors = async () => {
  const response = await api.get("/api/vendors");
  return response.data.map(mapVendorToFrontend);
};

const getVendorById = async (id) => {
  const response = await api.get(`/api/vendors/${id}`);
  return mapVendorToFrontend(response.data);
};

const createVendor = async (vendor) => {
  const response = await api.post(
    "/api/vendors",
    mapVendorToBackend(vendor)
  );

  return mapVendorToFrontend(response.data);
};

const updateVendor = async (id, vendor) => {
  const response = await api.put(
    `/api/vendors/${id}`,
    mapVendorToBackend(vendor)
  );

  return mapVendorToFrontend(response.data);
};

const deleteVendor = async (id) => {
  const response = await api.delete(`/api/vendors/${id}`);
  return response.data;
};

const vendorsService = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};

export default vendorsService;