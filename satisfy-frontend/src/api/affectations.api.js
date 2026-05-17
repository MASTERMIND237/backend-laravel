import api from './axios';

export const affectationsApi = {
  getAll: (params) => api.get('/affectations', { params }),
  getById: (id) => api.get(`/affectations/${id}`),
  create: (data) => api.post('/affectations', data),
  update: (id, data) => api.put(`/affectations/${id}`, data),
  delete: (id) => api.delete(`/affectations/${id}`),
  getPlanning: (params) => api.get('/affectations/planning', { params }),
  start: (id) => api.patch(`/affectations/${id}/demarrer`),
  finish: (id) => api.patch(`/affectations/${id}/terminer`),
  cancel: (id, data) => api.patch(`/affectations/${id}/annuler`, data),
};
