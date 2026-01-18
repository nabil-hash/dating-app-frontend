import { create } from 'zustand';
import { matchService } from '../api/matchService';

export const useMatchStore = create((set, get) => ({
  profiles: [],
  currentIndex: 0,
  matches: [],
  isLoading: false,
  error: null,

  fetchProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await matchService.discover();
      set({ 
        profiles: response.data, 
        currentIndex: 0,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement',
        isLoading: false 
      });
    }
  },

  swipe: async (direction) => {
    const { profiles, currentIndex } = get();
    const currentProfile = profiles[currentIndex];

    if (!currentProfile) return { success: false };

    try {
      const response = await matchService.swipe(currentProfile.id, direction);
      
      // Passer au profil suivant
      set({ currentIndex: currentIndex + 1 });

      return {
        success: true,
        matched: response.data.matched,
        match: response.data.match,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message,
      };
    }
  },

  fetchMatches: async () => {
    try {
      const response = await matchService.getMatches();
      set({ matches: response.data });
    } catch (error) {
      console.error('Erreur chargement matchs:', error);
    }
  },

  getCurrentProfile: () => {
    const { profiles, currentIndex } = get();
    return profiles[currentIndex] || null;
  },

  hasMoreProfiles: () => {
    const { profiles, currentIndex } = get();
    return currentIndex < profiles.length;
  },
}));