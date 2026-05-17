import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { maintenancesApi } from '../api/maintenances.api';
import { getApiErrorMessage } from '../utils/api';

export const useMaintenances = (filters = {}) => {
  const queryClient = useQueryClient();

  const maintenancesQuery = useQuery({
    queryKey: ['maintenances', filters],
    queryFn: () => maintenancesApi.getAll(filters).then((res) => res.data),
  });

  const statsQuery = useQuery({
    queryKey: ['maintenances-stats'],
    queryFn: () => maintenancesApi.getStats().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => maintenancesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      queryClient.invalidateQueries({ queryKey: ['maintenances-stats'] });
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      toast.success('Maintenance enregistrée');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Impossible d'enregistrer la maintenance")),
  });

  return {
    maintenances: maintenancesQuery.data?.data || [],
    maintenanceStats: statsQuery.data?.data || null,
    isLoading: maintenancesQuery.isLoading || statsQuery.isLoading,
    createMaintenance: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
