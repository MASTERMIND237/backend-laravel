import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../utils/api';

const getHomeRoute = (role) => (role === 'chauffeur' ? '/chauffeur' : '/dashboard');

export const useAuth = () => {
  const navigate = useNavigate();
  const { login: setLogin, logout: setLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: async (response) => {
      const token = response.token;

      if (!token) {
        console.error('Login succeeded without usable token:', response);
        setLogout();
        toast.error("Connexion incomplète: aucun token d'accès n'a été reçu.");
        return;
      }

      try {
        const meResponse = await authApi.getMe(token);
        const user = meResponse.user || response.user;
        setLogin(user, token);
        toast.success(`Bienvenue, ${user?.nom_complet || user?.prenom || 'utilisateur'}`);
        navigate(getHomeRoute(user?.role), { replace: true });
      } catch (error) {
        console.error('Post-login /auth/me failed:', error);
        setLogout();
        toast.error(getApiErrorMessage(error, "Connexion établie, mais impossible de charger votre profil."));
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(getApiErrorMessage(error, 'Identifiants invalides'));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setLogout();
      navigate('/login');
      toast.success('Déconnexion réussie');
    }
  });

  const registerMutation = useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: async (response) => {
      const token = response.token;

      if (!token) {
        console.error('Register succeeded without usable token:', response);
        setLogout();
        toast.error("Inscription créée, mais aucun token de connexion n'a été reçu.");
        return;
      }

      try {
        const meResponse = await authApi.getMe(token);
        const user = meResponse.user || response.user;
        setLogin(user, token);
        toast.success(`Inscription réussie. Bienvenue ${user?.nom_complet || user?.prenom || ''}`.trim());
        navigate(getHomeRoute(user?.role), { replace: true });
      } catch (error) {
        console.error('Post-register /auth/me failed:', error);
        setLogout();
        toast.error(getApiErrorMessage(error, "Compte créé, mais impossible de charger votre profil."));
      }
    },
    onError: (error) => {
      // Log the full response body when available to inspect validation errors (422)
      console.error('Register error response:', error.response?.data || error);

      // If there are field errors from Laravel, show them individually
      const fieldErrors = error?.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        Object.values(fieldErrors).flat().forEach((msg) => {
          if (typeof msg === 'string' && msg.trim()) toast.error(msg);
        });
        return;
      }

      toast.error(getApiErrorMessage(error, "Erreur lors de l'inscription"));
    }
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading:
      loginMutation.isPending || logoutMutation.isPending || registerMutation.isPending,
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  };
};
