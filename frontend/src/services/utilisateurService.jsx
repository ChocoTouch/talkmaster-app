import axiosInstance from '../utils/axiosInstance';

// Récupérer tous les utilisateurs
const getUtilisateurs = async () => {
  try {
    const response = await axiosInstance.get('/utilisateurs');
    return response.data;  // Retourne la liste des utilisateurs
  } catch (error) {
    console.error("Error fetching utilisateurs", error);
    throw error;
  }
};

// Créer un utilisateur
const createUtilisateur = async (utilisateurData) => {
  try {
    const response = await axiosInstance.post('/utilisateurs', utilisateurData);
    return response.data;  // Retourne l'utilisateur créé
  } catch (error) {
    console.error("Error creating utilisateur", error);
    throw error;
  }
};

export default { getUtilisateurs, createUtilisateur };