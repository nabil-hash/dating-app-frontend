import api from './axios';

export const photoService = {
  // Lister mes photos
  getMyPhotos: async () => {
    const response = await api.get('/photos');
    return response.data;
  },

  // Upload une photo
  uploadPhoto: async (formData) => {
    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer une photo
  deletePhoto: async (photoId) => {
    const response = await api.delete(`/photos/${photoId}`);
    return response.data;
  },

  // Définir comme photo principale
  setPrimary: async (photoId) => {
    const response = await api.put(`/photos/${photoId}/set-primary`);
    return response.data;
  },
};