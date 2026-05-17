import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { rapportsApi } from '../api/rapport.api';
import { getApiErrorMessage } from '../utils/api';

export const useRapports = (filters = {}) => {
  const queryClient = useQueryClient();

  const rapportsQuery = useQuery({
    queryKey: ['rapports', filters],
    queryFn: () => rapportsApi.getAll(filters).then((res) => res.data),
  });

  const statsQuery = useQuery({
    queryKey: ['rapports-stats'],
    queryFn: () => rapportsApi.getStats().then((res) => res.data),
  });

  const validateMutation = useMutation({
    mutationFn: (id) => rapportsApi.validate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapports'] });
      queryClient.invalidateQueries({ queryKey: ['rapports-stats'] });
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      toast.success('Rapport validé');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Impossible de valider ce rapport')),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, motif }) => rapportsApi.reject(id, { motif }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapports'] });
      queryClient.invalidateQueries({ queryKey: ['rapports-stats'] });
      toast.success('Rapport rejeté');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Impossible de rejeter ce rapport')),
  });

  return {
    rapports: rapportsQuery.data?.data || [],
    rapportStats: statsQuery.data?.data || null,
    isLoading: rapportsQuery.isLoading || statsQuery.isLoading,
    validateRapport: validateMutation.mutate,
    rejectRapport: rejectMutation.mutate,
    isValidating: validateMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
