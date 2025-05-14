import axiosInstance from '../utils/axiosInstance';

// Récupérer les salles
const getSalles = async () => {
  try {
    const response = await axiosInstance.get('/salles');
    return response.data;  // Retourne la liste des salles
  } catch (error) {
    console.error("Error fetching salles", error);
    throw error;
  }
};

// Créer une salle
const createSalle = async (salleData) => {
  try {
    const response = await axiosInstance.post('/salles', salleData);
    return response.data;  // Retourne la salle créée
  } catch (error) {
    console.error("Error creating salle", error);
    throw error;
  }
};

export default { getSalles, createSalle };