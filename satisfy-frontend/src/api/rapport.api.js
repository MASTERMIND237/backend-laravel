import api from './axios';

export const rapportsApi = {
  getAll: (params) => api.get('/rapports', { params }),
  getById: (id) => api.get(`/rapports/${id}`),
  create: (data) => api.post('/rapports', data),
  validate: (id) => api.patch(`/rapports/${id}/valider`),
  reject: (id, data) => api.patch(`/rapports/${id}/rejeter`, data),
  getStats: (params) => api.get('/rapports/statistiques', { params }),
};
