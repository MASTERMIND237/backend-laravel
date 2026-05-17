import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validators } from '../../utils/validators';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDrivers } from '../../hooks/useDrivers';

const DriverForm = ({ initialData = null }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validators.driver),
    defaultValues: initialData || {
      categorie_permis: 'D',
      statut: 'actif',
      annees_experience: 0,
    }
  });

  const { createDriver, isCreating } = useDrivers();

  const onSubmit = (data) => {
    const payload = {
      user_id: data.user_id,
      numero_permis: data.numero_permis,
      categorie_permis: data.categorie_permis || 'D',
      date_delivrance_permis: data.date_delivrance_permis,
      date_expiration_permis: data.date_expiration_permis,
      numero_cni: data.numero_cni || null,
      date_naissance: data.date_naissance || null,
      adresse: data.adresse || null,
      ville: data.ville || null,
      annees_experience: data.annees_experience || 0,
      statut: data.statut || 'actif',
      notes: data.notes || null,
    };

    createDriver(payload);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title={initialData ? "Modifier le profil" : "Enregistrer un chauffeur"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="User ID (associer un user existant)" 
              placeholder="ID utilisateur"
              type="number"
              {...register('user_id', { valueAsNumber: true })}
              error={errors.user_id?.message}
            />
            <Input 
              label="Numéro de permis" 
              placeholder="ex: CM-998877"
              {...register('numero_permis')}
              error={errors.numero_permis?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-cyprus font-medium text-sm">Catégorie permis</label>
              <select {...register('categorie_permis')} className="mt-2 w-full border-2 border-sand-dark rounded-xl px-4 py-2.5">
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
            <Input 
              label="Date délivrance permis" 
              type="date"
              {...register('date_delivrance_permis')}
              error={errors.date_delivrance_permis?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Date expiration permis" 
              type="date"
              {...register('date_expiration_permis')}
              error={errors.date_expiration_permis?.message}
            />
            <Input 
              label="Numéro CNI" 
              {...register('numero_cni')}
              error={errors.numero_cni?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Date de naissance" 
              type="date"
              {...register('date_naissance')}
              error={errors.date_naissance?.message}
            />
            <Input 
              label="Adresse" 
              {...register('adresse')}
              error={errors.adresse?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Ville" 
              {...register('ville')}
              error={errors.ville?.message}
            />
            <Input 
              label="Années d'expérience" 
              type="number"
              {...register('annees_experience', { valueAsNumber: true })}
              error={errors.annees_experience?.message}
            />
          </div>

          <div>
            <label className="text-cyprus font-medium text-sm">Statut</label>
            <select {...register('statut')} className="mt-2 w-full border-2 border-sand-dark rounded-xl px-4 py-2.5">
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          <div>
            <label className="text-cyprus font-medium text-sm">Notes</label>
            <textarea {...register('notes')} className="w-full border-2 border-sand-dark rounded-xl px-4 py-2.5 mt-2" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-sand-dark">
            <Button variant="ghost" type="button">Annuler</Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>Sauvegarder</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DriverForm;
