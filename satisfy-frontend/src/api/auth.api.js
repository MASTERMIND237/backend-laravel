import api from './axios';

const extractToken = (payload) =>
  payload?.token ||
  payload?.data?.token ||
  payload?.meta?.token ||
  payload?.original?.token ||
  null;

// Normalise les réponses d'auth pour toujours exposer { user, token }
export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', { device: 'web', ...credentials }).then((res) => {
      const payload = {
        user: res.data?.data || res.data?.user || res.data,
        token: extractToken(res.data),
        raw: res,
      };
      return payload;
    }),

  register: (payload) =>
    api.post('/auth/register', { device: 'web', ...payload }).then((res) => {
      const p = {
        user: res.data?.data || res.data?.user || res.data,
        token: extractToken(res.data),
        raw: res,
      };
      return p;
    }),

  logout: () => api.post('/auth/logout').then((res) => res.data),

  getMe: (token) =>
    api.get('/auth/me', token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : undefined).then((res) => {
      const p = { user: res.data?.data || res.data?.user || res.data, raw: res };
      return p;
    }),

  getDriverDashboard: () => api.get('/drivers/dashboard'),
};
