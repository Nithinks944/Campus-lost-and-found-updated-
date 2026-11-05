import axios from 'axios';

const API_URL = 'http://localhost:9001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  registerWithOtp: (data) => api.post('/auth/register-with-otp', data),
  loginWithOtp: (data) => api.post('/auth/login-with-otp', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getZoneStats: () => api.get('/items/stats/zones'),
  submitClaim: (id, data) => api.post(`/items/${id}/claim`, data),
  reviewClaim: (id, claimId, status) => api.patch(`/items/${id}/claims/${claimId}`, { status }),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  updateStatus: (id, status) => api.patch(`/items/${id}/status`, { status }),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const adminAPI = {
  getPendingItems: () => api.get('/admin/items/pending'),
  verifyItem: (id) => api.patch(`/admin/items/${id}/verify`),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
};

export default api;
