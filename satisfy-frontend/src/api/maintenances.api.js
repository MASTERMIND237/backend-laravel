import api from './axios';

export const maintenancesApi = {
  getAll: (params) => api.get('/maintenances', { params }),
  getById: (id) => api.get(`/maintenances/${id}`),
  create: (data) => api.post('/maintenances', data),
  update: (id, data) => api.put(`/maintenances/${id}`, data),
  delete: (id) => api.delete(`/maintenances/${id}`),
  getStats: (params) => api.get('/maintenances/stats', { params }),
};
