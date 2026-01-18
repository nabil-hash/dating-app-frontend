import api from './axios';

export const interestService = {
  // Récupérer tous les intérêts
  getAllInterests: async () => {
    const response = await api.get('/interests');
    return response.data;
  },

  // Récupérer mes intérêts
  getMyInterests: async () => {
    const response = await api.get('/interests/my');
    return response.data;
  },

  // Attacher des intérêts
  attachInterests: async (interestIds) => {
    const response = await api.post('/interests/attach', {
      interest_ids: interestIds,
    });
    return response.data;
  },
};