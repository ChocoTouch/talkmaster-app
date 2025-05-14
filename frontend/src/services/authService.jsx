import axiosInstance from '../utils/axiosInstance';

// Inscription d'un nouvel utilisateur
const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;  // Retourne l'utilisateur créé
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};


export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export default { registerUser, loginUser };