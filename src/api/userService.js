import api from './axios';

export const userService = {
  // Mettre à jour le profil
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Voir un profil public
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};