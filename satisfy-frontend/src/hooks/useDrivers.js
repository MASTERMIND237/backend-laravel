import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi } from '../api/drivers.api';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../utils/api';

export const useDrivers = (filters = {}) => {
  const queryClient = useQueryClient();

  const driversQuery = useQuery({
    queryKey: ['drivers', filters],
    queryFn: () => driversApi.getAll(filters).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => driversApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Chauffeur supprimé');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Impossible de supprimer ce chauffeur'))
  });

  const createMutation = useMutation({
    mutationFn: (data) => driversApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Chauffeur créé avec succès');
    },
    onError: (err) => {
      console.error('Create driver error:', err);
      toast.error(getApiErrorMessage(err, 'Erreur lors de la création'));
    }
  });

  return {
    drivers: driversQuery.data?.data || [],
    isLoading: driversQuery.isLoading,
    deleteDriver: deleteMutation.mutate,
    createDriver: createMutation.mutate,
    isCreating: createMutation.isPending
  };
};
