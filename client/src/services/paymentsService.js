import api from "./api";

const mapPayment = (payment) => ({
  id: payment.id,
  registrationId: payment.registration_id,
  festivalId: payment.festival_id,
  vendorName: payment.vendor_name,
  year: payment.year,
  festivalName: payment.festival_name,
  position: payment.position,
  meters: payment.meters,
  amount: payment.amount,
  createdAt: payment.created_at,
});

const getAllPayments = async () => {
  const response = await api.get("/api/payments");
  return response.data.map(mapPayment);
};

const getPaymentById = async (id) => {
  const response = await api.get(`/api/payments/${id}`);
  return mapPayment(response.data);
};

const createPayment = async (payment) => {
  const response = await api.post("/api/payments", {
    registration_id: payment.registrationId,
    festival_id: payment.festivalId,
    position: payment.position,
    meters: payment.meters,
    amount: payment.amount,
  });

  return mapPayment(response.data);
};

const updatePayment = async (id, payment) => {
  const response = await api.put(`/api/payments/${id}`, {
    registration_id: payment.registrationId,
    festival_id: payment.festivalId,
    position: payment.position,
    meters: payment.meters,
    amount: payment.amount,
  });

  return mapPayment(response.data);
};

const deletePayment = async (id) => {
  const response = await api.delete(`/api/payments/${id}`);
  return response.data;
};

export default {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};