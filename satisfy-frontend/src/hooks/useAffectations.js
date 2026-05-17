import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { affectationsApi } from '../api/affectations.api';
import { getApiErrorMessage } from '../utils/api';

export const useAffectations = (filters = {}) => {
  const queryClient = useQueryClient();

  const affectationsQuery = useQuery({
    queryKey: ['affectations', filters],
    queryFn: () => affectationsApi.getAll(filters).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => affectationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affectations'] });
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Affectation créée avec succès');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Impossible de créer l'affectation")),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, raison }) => affectationsApi.cancel(id, { raison }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affectations'] });
      toast.success('Affectation annulée');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Impossible d'annuler l'affectation")),
  });

  return {
    affectations: affectationsQuery.data?.data || [],
    pagination: affectationsQuery.data?.meta || null,
    isLoading: affectationsQuery.isLoading,
    createAffectation: createMutation.mutate,
    cancelAffectation: cancelMutation.mutate,
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
};

export const usePlanning = (params) =>
  useQuery({
    queryKey: ['affectations-planning', params],
    queryFn: () => affectationsApi.getPlanning(params).then((res) => res.data),
    enabled: Boolean(params?.date_debut && params?.date_fin),
  });
