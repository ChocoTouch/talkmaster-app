import axiosInstance from '../utils/axiosInstance';

// Récupérer les plannings
const getPlannings = async () => {
  try {
    const response = await axiosInstance.get('/plannings');
    return response.data;  // Retourne la liste des plannings
  } catch (error) {
    console.error("Error fetching plannings", error);
    throw error;
  }
};

// Mettre à jour un planning
const updatePlanning = async (id, planningData) => {
  try {
    const response = await axiosInstance.put(`/plannings/${id}`, planningData);
    return response.data;  // Retourne le planning mis à jour
  } catch (error) {
    console.error("Error updating planning", error);
    throw error;
  }
};

// Récupérer un planning filtré
const getFilteredPlanning = async (filters) => {
  try {
    const response = await axiosInstance.get('/plannings/planning', { params: filters });
    return response.data;  // Retourne le planning filtré
  } catch (error) {
    console.error("Error fetching filtered planning", error);
    throw error;
  }
};

export default { getPlannings, updatePlanning, getFilteredPlanning };