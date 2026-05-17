import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { affectationsApi } from '../api/affectations.api';
import { rapportsApi } from '../api/rapport.api';
import { getApiErrorMessage } from '../utils/api';

export const useDriverDashboard = () =>
  useQuery({
    queryKey: ['driver-dashboard'],
    queryFn: () => authApi.getDriverDashboard().then((res) => res.data),
  });

export const useDriverAffectations = (filters = {}) =>
  useQuery({
    queryKey: ['driver-affectations', filters],
    queryFn: () => affectationsApi.getAll(filters).then((res) => res.data),
  });

export const useDriverRapports = (filters = {}) =>
  useQuery({
    queryKey: ['driver-rapports', filters],
    queryFn: () => rapportsApi.getAll(filters).then((res) => res.data),
  });

export const useDriverActions = () => {
  const queryClient = useQueryClient();

  const refreshDriverSpace = () => {
    queryClient.invalidateQueries({ queryKey: ['driver-dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['driver-affectations'] });
    queryClient.invalidateQueries({ queryKey: ['driver-rapports'] });
    queryClient.invalidateQueries({ queryKey: ['vehicules-carte'] });
  };

  const startAffectation = useMutation({
    mutationFn: (id) => affectationsApi.start(id),
    onSuccess: () => {
      refreshDriverSpace();
      toast.success('Mission démarrée');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Impossible de démarrer cette mission')),
  });

  const finishAffectation = useMutation({
    mutationFn: (id) => affectationsApi.finish(id),
    onSuccess: () => {
      refreshDriverSpace();
      toast.success('Mission terminée');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Impossible de terminer cette mission')),
  });

  const submitRapport = useMutation({
    mutationFn: (payload) => rapportsApi.create(payload),
    onSuccess: () => {
      refreshDriverSpace();
      toast.success('Rapport envoyé');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Impossible d'envoyer le rapport")),
  });

  return {
    demarrerMission: startAffectation.mutate,
    terminerMission: finishAffectation.mutate,
    soumettreRapport: submitRapport.mutate,
    isStartingMission: startAffectation.isPending,
    isFinishingMission: finishAffectation.isPending,
    isSubmittingRapport: submitRapport.isPending,
  };
};
