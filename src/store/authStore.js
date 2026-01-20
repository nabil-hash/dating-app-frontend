import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API_URL from '../config/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Fonction d'inscription
      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            // Gérer les erreurs de validation Laravel
            if (data.errors) {
              const errorMessages = Object.values(data.errors).flat().join(', ');
              set({ isLoading: false });
              return { success: false, error: errorMessages };
            }
            
            set({ isLoading: false });
            return { success: false, error: data.message || 'Erreur lors de l\'inscription' };
          }

          // Succès
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Stocker le token dans localStorage aussi (optionnel)
          localStorage.setItem('token', data.token);

          return { success: true };
          
        } catch (error) {
          console.error('Erreur d\'inscription:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'Erreur de connexion au serveur. Vérifiez votre connexion.' 
          };
        }
      },

      // Fonction de connexion
      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ isLoading: false });
            return { success: false, error: data.message || 'Email ou mot de passe incorrect' };
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', data.token);

          return { success: true };
          
        } catch (error) {
          console.error('Erreur de connexion:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'Erreur de connexion au serveur' 
          };
        }
      },

      // Fonction de déconnexion
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
      },

      // Vérifier l'authentification au chargement
      checkAuth: async () => {
        const token = get().token || localStorage.getItem('token');
        
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const response = await fetch(`${API_URL}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token invalide');
          }

          const data = await response.json();
          
          set({
            user: data,
            token: token,
            isAuthenticated: true,
          });
          
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'auth-storage', // Nom dans localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);