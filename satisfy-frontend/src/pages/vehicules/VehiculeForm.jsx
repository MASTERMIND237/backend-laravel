import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validators } from '../../utils/validators';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useVehicules } from '../../hooks/useVehicules';

const VehiculeForm = ({ initialData = null }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validators.vehicule),
    defaultValues: initialData || {
      annee_fabrication: new Date().getFullYear(),
      type_vehicule: 'minibus',
      capacite_passagers: 1,
      carburant: 'diesel',
      kilometrage_actuel: 0,
      statut: 'disponible',
    }
  });

  const { createVehicule, isCreating } = useVehicules();

  const onSubmit = (data) => {
    const payload = {
      marque: data.marque,
      modele: data.modele,
      annee_fabrication: data.annee_fabrication,
      immatriculation: data.immatriculation,
      type_vehicule: data.type_vehicule,
      capacite_passagers: data.capacite_passagers,
      couleur: data.couleur || null,
      numero_chassis: data.numero_chassis || null,
      carburant: data.carburant,
      kilometrage_actuel: data.kilometrage_actuel,
      date_mise_en_service: data.date_mise_en_service || null,
      date_expiration_assurance: data.date_expiration_assurance || null,
      date_expiration_visite_technique: data.date_expiration_visite_technique || null,
      statut: data.statut || 'disponible',
      notes: data.notes || null,
    };

    createVehicule(payload);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title={initialData ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Marque" 
              placeholder="ex: Toyota"
              {...register('marque')}
              error={errors.marque?.message}
            />
            <Input 
              label="Modèle" 
              placeholder="ex: Prado"
              {...register('modele')}
              error={errors.modele?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-cyprus font-medium text-sm">Type de véhicule</label>
              <select 
                {...register('type_vehicule')}
                className="bg-white border-2 border-sand-dark rounded-xl px-4 py-2.5 outline-none focus:border-cyprus"
              >
                <option value="bus">Bus</option>
                <option value="minibus">Minibus</option>
                <option value="berline">Berline</option>
                <option value="van">Van</option>
              </select>
              {errors.type_vehicule?.message ? (
                <span className="text-red-500 text-xs mt-1 ml-1">{errors.type_vehicule.message}</span>
              ) : null}
            </div>
            <Input 
              label="Capacité passagers" 
              type="number"
              {...register('capacite_passagers', { valueAsNumber: true })}
              error={errors.capacite_passagers?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-cyprus font-medium text-sm">Carburant</label>
              <select
                {...register('carburant')}
                className="bg-white border-2 border-sand-dark rounded-xl px-4 py-2.5 outline-none focus:border-cyprus"
              >
                <option value="diesel">Diesel</option>
                <option value="essence">Essence</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Electrique</option>
              </select>
              {errors.carburant?.message ? (
                <span className="text-red-500 text-xs mt-1 ml-1">{errors.carburant.message}</span>
              ) : null}
            </div>
            <Input
              label="Kilométrage actuel"
              type="number"
              {...register('kilometrage_actuel', { valueAsNumber: true })}
              error={errors.kilometrage_actuel?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Année de fabrication"
              type="number"
              {...register('annee_fabrication', { valueAsNumber: true })}
              error={errors.annee_fabrication?.message}
            />
            <Input
              label="Couleur"
              {...register('couleur')}
              error={errors.couleur?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Numéro de châssis"
              {...register('numero_chassis')}
              error={errors.numero_chassis?.message}
            />
            <Input
              label="Date de mise en service"
              type="date"
              {...register('date_mise_en_service')}
              error={errors.date_mise_en_service?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Expiration assurance"
              type="date"
              {...register('date_expiration_assurance')}
              error={errors.date_expiration_assurance?.message}
            />
            <Input
              label="Expiration visite technique"
              type="date"
              {...register('date_expiration_visite_technique')}
              error={errors.date_expiration_visite_technique?.message}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-cyprus font-medium text-sm">Statut</label>
            <select
              {...register('statut')}
              className="bg-white border-2 border-sand-dark rounded-xl px-4 py-2.5 outline-none focus:border-cyprus"
            >
              <option value="disponible">Disponible</option>
              <option value="en_route">En route</option>
              <option value="en_maintenance">En maintenance</option>
              <option value="hors_service">Hors service</option>
            </select>
          </div>

          <div>
            <label className="text-cyprus font-medium text-sm">Notes</label>
            <textarea
              {...register('notes')}
              className="w-full border-2 border-sand-dark rounded-xl px-4 py-2.5 mt-2"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button">Annuler</Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>Enregistrer le véhicule</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VehiculeForm;
