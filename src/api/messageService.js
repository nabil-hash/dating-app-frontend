import api from './axios';

export const messageService = {
  // Obtenir les conversations
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Obtenir les messages d'une conversation
  getMessages: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/messages`);
    return response.data;
  },

  // Envoyer un message
  sendMessage: async (matchId, content, type = 'text') => {
    const response = await api.post(`/matches/${matchId}/messages`, {
      content,
      type,
    });
    return response.data;
  },

  // Marquer comme lu
  markAsRead: async (matchId) => {
    const response = await api.post(`/matches/${matchId}/messages/read`);
    return response.data;
  },
};