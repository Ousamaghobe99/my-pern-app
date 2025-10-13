import axios from 'axios';

// API base URL - 
const API_BASE_URL = window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL;



// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getUserByMatricule: (matricule) => api.get(`/users/matricule/${matricule}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStatistics: () => api.get('/users/statistics'),
};

// Interfaces API
export const interfacesAPI = {
  getInterfaces: (params) => api.get('/interfaces', { params }),
  getInterface: (id) => api.get(`/interfaces/${id}`),
  createInterface: (interfaceData) => api.post('/interfaces', interfaceData),
  updateInterface: (id, interfaceData) => api.put(`/interfaces/${id}`, interfaceData),
  deleteInterface: (id) => api.delete(`/interfaces/${id}`),
  moveInterface: (id, moveData) => api.post(`/interfaces/${id}/move`, moveData),
  getInterfaceStatistics: () => api.get('/interfaces/statistics'),
};

// Locations API
export const locationsAPI = {
  getLocations: (params) => api.get('/locations', { params }),
  getLocation: (id) => api.get(`/locations/${id}`),
  createLocation: (locationData) => api.post('/locations', locationData),
  updateLocation: (id, locationData) => api.put(`/locations/${id}`, locationData),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
  getLocationStatistics: () => api.get('/locations/statistics'),
};

// Maintenance API
export const maintenanceAPI = {
  getTickets: (params) => api.get('/maintenance', { params }),
  getTicket: (id) => api.get(`/maintenance/${id}`),
  createTicket: (ticketData) => api.post('/maintenance', ticketData),
  updateTicket: (id, ticketData) => api.put(`/maintenance/${id}`, ticketData),
  deleteTicket: (id) => api.delete(`/maintenance/${id}`),
  addLog: (id, logData) => api.post(`/maintenance/${id}/logs`, logData),
  getMaintenanceStatistics: () => api.get('/maintenance/statistics'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health', { baseURL: API_BASE_URL.replace('/api', '') }),
};

export default api;

