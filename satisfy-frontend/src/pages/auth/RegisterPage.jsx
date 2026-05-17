import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validators } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const RegisterPage = () => {
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validators.register),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      password_confirmation: '',
      role: 'chauffeur',
    },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-sand p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-cyprus mb-2">Inscription Chauffeur</h2>
        <p className="mb-4 text-sm text-cyprus/60">
          Cet espace public est réservé aux chauffeurs. Votre profil sera ensuite suivi par le gestionnaire.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Prénom" error={errors.prenom?.message} {...register('prenom')} />
          <Input label="Nom" error={errors.nom?.message} {...register('nom')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Téléphone" error={errors.telephone?.message} {...register('telephone')} />
          <Input label="Mot de passe" type="password" error={errors.password?.message} {...register('password')} />
          <Input label="Confirmation" type="password" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
          <input type="hidden" {...register('role')} />

          <p className="text-xs text-cyprus/60">
            Le mot de passe doit contenir au moins 8 caractères, avec au moins une lettre et un chiffre.
          </p>

          <Button type="submit" className="w-full py-3" isLoading={isLoading}>S'inscrire</Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
