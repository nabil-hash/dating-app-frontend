import { create } from 'zustand';
import { interestService } from '../api/interestService';

export const useInterestStore = create((set) => ({
  allInterests: [],
  myInterests: [],
  isLoading: false,
  error: null,

  fetchAllInterests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await interestService.getAllInterests();
      set({ allInterests: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement',
        isLoading: false,
      });
    }
  },

  fetchMyInterests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await interestService.getMyInterests();
      set({ myInterests: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement',
        isLoading: false,
      });
    }
  },

  attachInterests: async (interestIds) => {
    try {
      const response = await interestService.attachInterests(interestIds);
      set({ myInterests: response.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  },
}));