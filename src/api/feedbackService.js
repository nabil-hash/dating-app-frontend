import api from './axios';

export const feedbackService = {
  sendFeedback: async (data) => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  getAllFeedbacks: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/feedback/${id}/status`, { status });
    return response.data;
  },
};