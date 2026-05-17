import api from './axios';

export const routesApi = {
  getAll: (params) => api.get('/routes', { params }),
  getCities: () => api.get('/routes/villes'),
};
