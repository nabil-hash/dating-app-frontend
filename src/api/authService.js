import api from './axios';

export const authService = {
  // Inscription
  register: async (data) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  // Connexion
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Obtenir l'utilisateur connecté
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};