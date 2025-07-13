import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const universitiesAPI = {
  getAll: () => api.get('/universities'),
  getById: (id: number) => api.get(`/universities/${id}`),
  create: (data: any) => api.post('/universities', data),
  update: (id: number, data: any) => api.put(`/universities/${id}`, data),
  delete: (id: number) => api.delete(`/universities/${id}`),
};

export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: number) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: number, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};

export const adminsAPI = {
  getAll: () => api.get('/admins'),
  getById: (id: number) => api.get(`/admins/${id}`),
  create: (data: any) => api.post('/admins', data),
  update: (id: number, data: any) => api.put(`/admins/${id}`, data),
  delete: (id: number) => api.delete(`/admins/${id}`),
};