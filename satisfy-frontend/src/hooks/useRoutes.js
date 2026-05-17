import { useQuery } from '@tanstack/react-query';
import { routesApi } from '../api/routes.api';

export const useRoutes = (filters = {}) =>
  useQuery({
    queryKey: ['routes', filters],
    queryFn: () => routesApi.getAll(filters).then((res) => res.data),
  });
