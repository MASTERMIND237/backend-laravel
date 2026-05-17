import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDrivers } from '../../hooks/useDrivers';
import { useVehicules } from '../../hooks/useVehicules';
import { useRoutes } from '../../hooks/useRoutes';
import { useAffectations } from '../../hooks/useAffectations';

const AffectationForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre_passagers: 0,
    },
  });

  const { drivers } = useDrivers({ statut: 'actif' });
  const { vehicules } = useVehicules({ statut: 'disponible' });
  const routesQuery = useRoutes({ statut: 'active' });
  const { createAffectation, isCreating } = useAffectations();

  const onSubmit = (data) => {
    createAffectation(
      {
        driver_id: Number(data.driver_id),
        vehicle_id: Number(data.vehicle_id),
        route_id: Number(data.route_id),
        date_depart: data.date_depart,
        heure_depart: data.heure_depart,
        date_arrivee_prevue: data.date_arrivee_prevue || null,
        heure_arrivee_prevue: data.heure_arrivee_prevue || null,
        nombre_passagers: Number(data.nombre_passagers || 0),
        observations: data.observations || null,
      },
      {
        onSuccess: () => navigate('/affectations'),
      },
    );
  };

  const routes = routesQuery.data?.data || [];

  return (
    <div className="mx-auto max-w-2xl">
      <Card title="Nouvelle Affectation">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectField
              label="Véhicule"
              error={errors.vehicle_id?.message}
              registration={register('vehicle_id', { required: true })}
              options={vehicules.map((vehicule) => ({
                value: vehicule.id,
                label: vehicule.libelle,
              }))}
            />

            <SelectField
              label="Chauffeur"
              error={errors.driver_id?.message}
              registration={register('driver_id', { required: true })}
              options={drivers.map((driver) => ({
                value: driver.id,
                label: driver.user?.nom_complet || `Chauffeur #${driver.id}`,
              }))}
            />
          </div>

          <SelectField
            label="Route"
            error={errors.route_id?.message}
            registration={register('route_id', { required: true })}
            options={routes.map((route) => ({
              value: route.id,
              label: route.trajet,
            }))}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input label="Date de départ" type="date" error={errors.date_depart?.message} {...register('date_depart', { required: true })} />
            <Input label="Heure de départ" type="time" error={errors.heure_depart?.message} {...register('heure_depart', { required: true })} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input label="Date arrivée prévue" type="date" {...register('date_arrivee_prevue')} />
            <Input label="Heure arrivée prévue" type="time" {...register('heure_arrivee_prevue')} />
          </div>

          <Input
            label="Nombre de passagers"
            type="number"
            {...register('nombre_passagers')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-sm font-medium text-cyprus">Observations</label>
            <textarea
              {...register('observations')}
              rows={4}
              className="rounded-xl border-2 border-sand-dark bg-white px-4 py-2.5 outline-none focus:border-cyprus"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-sand-dark pt-6">
            <Button variant="ghost" type="button" onClick={() => navigate('/affectations')}>Annuler</Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>Confirmer l'affectation</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const SelectField = ({ label, registration, options, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="ml-1 text-sm font-medium text-cyprus">{label}</label>
    <select
      {...registration}
      className="rounded-xl border-2 border-sand-dark bg-white px-4 py-2.5 outline-none focus:border-cyprus"
    >
      <option value="">Sélectionner...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error ? <span className="ml-1 mt-1 text-xs text-red-500">{error}</span> : null}
  </div>
);

export default AffectationForm;
