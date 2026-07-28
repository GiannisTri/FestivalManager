import api from "./api";

const mapFestival = (festival) => ({
  id: festival.id,
  name: festival.name,
  location: festival.location,

  startDate: festival.start_date
    ? festival.start_date.split("T")[0]
    : null,

  endDate: festival.end_date
    ? festival.end_date.split("T")[0]
    : null,
});

const getAllFestivals = async () => {
  const response = await api.get("/api/festivals");

  return response.data.map(mapFestival);
};

const getFestivalById = async (id) => {
  const response = await api.get(`/api/festivals/${id}`);

  return mapFestival(response.data);
};

const festivalsService = {
  getAllFestivals,
  getFestivalById,
};

export default festivalsService;