import { create } from 'zustand';
import { photoService } from '../api/photoService';

export const usePhotoStore = create((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,

  fetchPhotos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await photoService.getMyPhotos();
      set({ photos: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement',
        isLoading: false 
      });
    }
  },

  uploadPhoto: async (file, orderIndex, isPrimary = false) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('order_index', orderIndex);
    formData.append('is_primary', isPrimary ? '1' : '0');

    try {
      const response = await photoService.uploadPhoto(formData);
      set({ photos: [...get().photos, response.data] });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de l\'upload' 
      };
    }
  },

  deletePhoto: async (photoId) => {
    try {
      await photoService.deletePhoto(photoId);
      set({ photos: get().photos.filter(p => p.id !== photoId) });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la suppression' 
      };
    }
  },

  setPrimaryPhoto: async (photoId) => {
    try {
      await photoService.setPrimary(photoId);
      const updatedPhotos = get().photos.map(p => ({
        ...p,
        is_primary: p.id === photoId
      }));
      set({ photos: updatedPhotos });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message 
      };
    }
  },
}));