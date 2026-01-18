import { create } from 'zustand';
import { messageService } from '../api/messageService';

export const useMessageStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  // Charger les conversations
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageService.getConversations();
      set({ conversations: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur chargement conversations',
        isLoading: false,
      });
    }
  },

  // Charger les messages d'une conversation
  fetchMessages: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageService.getMessages(matchId);
      set({ 
        messages: response.data, 
        currentConversation: matchId,
        isLoading: false 
      });
      
      // Marquer comme lu
      await messageService.markAsRead(matchId);
      
      // Mettre à jour le compteur non lu dans conversations
      const conversations = get().conversations.map(conv => 
        conv.match_id === matchId ? { ...conv, unread_count: 0 } : conv
      );
      set({ conversations });
      
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur chargement messages',
        isLoading: false,
      });
    }
  },

  // Envoyer un message
  sendMessage: async (matchId, content) => {
    try {
      const response = await messageService.sendMessage(matchId, content);
      
      // Ajouter le message localement
      const newMessage = response.data;
      set({ messages: [...get().messages, newMessage] });
      
      // Mettre à jour la conversation (dernier message)
      const conversations = get().conversations.map(conv =>
        conv.match_id === matchId
          ? {
              ...conv,
              last_message: {
                content: newMessage.content,
                sent_at: newMessage.sent_at,
                is_mine: true,
              },
            }
          : conv
      );
      set({ conversations });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur envoi message',
      };
    }
  },

  // Ajouter un message reçu (temps réel)
  addReceivedMessage: (message) => {
    const currentConv = get().currentConversation;
    
    // Si on est sur la conversation, ajouter le message
    if (currentConv === message.match_id) {
      set({ messages: [...get().messages, message] });
      
      // Marquer comme lu automatiquement
      messageService.markAsRead(message.match_id);
    } else {
      // Sinon, incrémenter le compteur non lu
      const conversations = get().conversations.map(conv =>
        conv.match_id === message.match_id
          ? { 
              ...conv, 
              unread_count: (conv.unread_count || 0) + 1,
              last_message: {
                content: message.content,
                sent_at: message.created_at,
                is_mine: false,
              },
            }
          : conv
      );
      set({ conversations });
    }
  },

  // Réinitialiser la conversation actuelle
  clearCurrentConversation: () => {
    set({ currentConversation: null, messages: [] });
  },
}));