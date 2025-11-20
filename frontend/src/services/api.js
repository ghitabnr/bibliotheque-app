import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Création de l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
},
register: async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
},
getProfile: async () => {
  const response = await api.get('/auth/me');
  return response.data;
},
};

// Service des livres
export const livreService = {
  getAll: async (params = {}) => {
    const response = await api.get('/livres', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/livres/${id}`);
    return response.data;
  },

  create: async (livreData) => {
    const response = await api.post('/livres', livreData);
    return response.data;
  },

  update: async (id, livreData) => {
    const response = await api.put(`/livres/${id}`, livreData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/livres/${id}`);
    return response.data;
  },

  exportXML: async () => {
    const response = await api.get('/livres/export/xml');
    return response.data;
  },
};

// Service des membres
export const membreService = {
  getAll: async (params = {}) => {
    const response = await api.get('/membres', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/membres/${id}`);
    return response.data;
  },

  create: async (membreData) => {
    const response = await api.post('/membres', membreData);
    return response.data;
  },

  update: async (id, membreData) => {
    const response = await api.put(`/membres/${id}`, membreData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/membres/${id}`);
    return response.data;
  },
};

// Service des emprunts
export const empruntService = {
  getAll: async (params = {}) => {
    const response = await api.get('/emprunts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/emprunts/${id}`);
    return response.data;
  },

  create: async (empruntData) => {
    const response = await api.post('/emprunts', empruntData);
    return response.data;
  },

  retourner: async (id) => {
    const response = await api.put(`/emprunts/${id}/retour`);
    return response.data;
  },

  getEnRetard: async () => {
    const response = await api.get('/emprunts/retard');
    return response.data;
  },
};

export default api;