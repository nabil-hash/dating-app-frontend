import api from './axios';

export const matchService = {
  // Découvrir des profils
  discover: async () => {
    const response = await api.get('/discover');
    return response.data;
  },

  // Swiper un profil
  swipe: async (swipedId, direction) => {
    const response = await api.post('/swipe', {
      swiped_id: swipedId,
      direction: direction, // 'like' ou 'pass'
    });
    return response.data;
  },

  // Obtenir ses matchs
  getMatches: async () => {
    const response = await api.get('/matches');
    return response.data;
  },

  // Unmatch
  unmatch: async (matchId) => {
    const response = await api.delete(`/matches/${matchId}`);
    return response.data;
  },
};