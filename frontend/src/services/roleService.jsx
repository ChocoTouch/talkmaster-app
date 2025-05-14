import axiosInstance from '../utils/axiosInstance';

// Récupérer les rôles
const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/roles');
    return response.data;  // Retourne la liste des rôles
  } catch (error) {
    console.error("Error fetching roles", error);
    throw error;
  }
};

// Créer un rôle
const createRole = async (roleData) => {
  try {
    const response = await axiosInstance.post('/roles', roleData);
    return response.data;  // Retourne le rôle créé
  } catch (error) {
    console.error("Error creating role", error);
    throw error;
  }
};

export default { getRoles, createRole };