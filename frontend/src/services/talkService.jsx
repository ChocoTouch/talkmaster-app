import axiosInstance from '../utils/axiosInstance';

// Récupérer mes talks
const getMyTalks = async () => {
  try {
    const response = await axiosInstance.get('/talks/me');
    return response.data;  // Retourne mes talks
  } catch (error) {
    console.error("Error fetching my talks", error);
    throw error;
  }
};

// Récupérer la liste des talks
const getTalks = async () => {
  try {
    const response = await axiosInstance.get('/talks');
    return response.data;  // Retourne la liste des talks
  } catch (error) {
    console.error("Error fetching talks", error);
    throw error;
  }
};

// Créer un talk
const createTalk = async (talkData) => {
  try {
    const response = await axiosInstance.post('/talks', talkData);
    return response.data;  // Retourne le talk créé
  } catch (error) {
    console.error("Error creating talk", error);
    throw error;
  }
};

// Mettre à jour un talk
const updateTalk = async (id, talkData) => {
  try {
    const response = await axiosInstance.put(`/talks/${id}`, talkData);
    return response.data;  // Retourne le talk mis à jour
  } catch (error) {
    console.error("Error updating talk", error);
    throw error;
  }
};

// Supprimer un talk
const deleteTalk = async (id) => {
  try {
    const response = await axiosInstance.delete(`/talks/${id}`);
    return response.data;  // Retourne la réponse de suppression
  } catch (error) {
    console.error("Error deleting talk", error);
    throw error;
  }
};

// Mettre à jour le statut d'un talk
const updateTalkStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/talks/${id}/status`, { statut: status });
    return response.data;  // Retourne le talk mis à jour avec le statut
  } catch (error) {
    console.error("Error updating talk status", error);
    throw error;
  }
};

// Planifier un talk
const scheduleTalk = async (id, planningData) => {
  try {
    const response = await axiosInstance.patch(`/talks/${id}/schedule`, planningData);
    return response.data;  // Retourne le talk planifié
  } catch (error) {
    console.error("Error scheduling talk", error);
    throw error;
  }
};

export default { getMyTalks, getTalks, createTalk, updateTalk, deleteTalk, updateTalkStatus, scheduleTalk };