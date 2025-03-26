import { defineStore } from 'pinia';
import apiClient from '../services/axios';
import { jwtDecode } from "jwt-decode"; // Installe-le si nécessaire : npm install jwt-decode

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    getUserRole: (state) => {
      if (!state.user || !state.user.roles) return 'user';
      return state.user.roles.includes('ROLE_ADMIN') ? 'admin' : 'user';
    },

    isAdmin: (state) => {
      console.log('User roles in isAdmin getter:', state.user?.roles);
      return state.user?.roles?.includes('ROLE_ADMIN') || false;
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await apiClient.post('/login', credentials);
        this.token = response.data.token;
        
        console.log("🔐 Token reçu après connexion :", this.token);

        localStorage.setItem('token', this.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        await this.fetchUser(); // Charge l'utilisateur après connexion
      } catch (error) {
        console.error('🚨 Erreur lors de la connexion:', error.response?.data || error);
        throw error;
      }
    },

    async register(data) {
      console.log("🔧 Appel à register avec", data);
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
            Accept: 'application/ld+json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          console.error('🧨 Erreur API register :', err);
          throw new Error('Inscription échouée');
        }

        console.log("✅ Utilisateur créé avec succès !");
        return await response.json();
      } catch (e) {
        console.error("❌ Erreur dans register :", e);
        throw e;
      }
    },

    async fetchUser() {
      try {
        if (!this.token) {
          console.warn("🚨 Aucun token, impossible de récupérer l'utilisateur.");
          return;
        }
    
        console.log("🔍 Token détecté, récupération de l'utilisateur...");
    
        const decodedToken = jwtDecode(this.token);
        console.log("📢 Payload JWT :", decodedToken);
    
        const userEmail = decodedToken.username || decodedToken.email;
        if (!userEmail) {
          console.error("⚠️ Impossible de récupérer l'email depuis le token !");
          return;
        }
    
        console.log("📩 Email extrait du token :", userEmail);
    
        // 🔥 Correction : Ajout du header Authorization avec le Bearer token
        const response = await apiClient.get(`/users?email=${encodeURIComponent(userEmail)}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
    
        if (!response.data || response.data.length === 0) {
          console.error("🚨 Aucun utilisateur trouvé avec cet email !");
          return;
        }
    
        this.user = response.data[0];
        console.log("✅ Profil utilisateur récupéré :", this.user);
      } catch (error) {
        console.error("🚨 Erreur lors de la récupération du profil utilisateur :", error.response?.data || error);
        this.user = null;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
    },

    async initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        console.log("🔄 Token détecté, tentative d'initialisation...");
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await this.fetchUser(); // Charge l’utilisateur si un token est présent
      }
    },
  },
});
