import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useVehicules } from '../../hooks/useVehicules';
import { useMaintenances } from '../../hooks/useMaintenances';

const maintenanceTypes = [
  'vidange',
  'pneumatiques',
  'freins',
  'revision_generale',
  'carrosserie',
  'moteur',
  'transmission',
  'electrique',
  'climatisation',
  'autre',
];

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      type_maintenance: 'vidange',
      statut: 'planifiee',
      cout: 0,
    },
  });

  const { vehicules } = useVehicules();
  const { createMaintenance, isCreating } = useMaintenances();

  const onSubmit = (data) => {
    createMaintenance(
      {
        vehicle_id: Number(data.vehicle_id),
        type_maintenance: data.type_maintenance,
        titre: data.titre,
        description: data.description || null,
        date_maintenance: data.date_maintenance,
        heure_debut: data.heure_debut || null,
        heure_fin: data.heure_fin || null,
        garage_prestataire: data.garage_prestataire || null,
        cout: Number(data.cout || 0),
        kilometrage_a_lintervention: data.kilometrage_a_lintervention ? Number(data.kilometrage_a_lintervention) : null,
        prochain_entretien_km: data.prochain_entretien_km ? Number(data.prochain_entretien_km) : null,
        prochaine_maintenance_date: data.prochaine_maintenance_date || null,
        statut: data.statut,
        pieces_remplacees: data.pieces_remplacees || null,
        notes: data.notes || null,
      },
      {
        onSuccess: () => navigate('/maintenances'),
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card title="Programmer une intervention technique">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectField
              label="Véhicule"
              registration={register('vehicle_id', { required: true })}
              options={vehicules.map((vehicule) => ({
                value: vehicule.id,
                label: vehicule.libelle,
              }))}
            />

            <SelectField
              label="Type d'intervention"
              registration={register('type_maintenance', { required: true })}
              options={maintenanceTypes.map((type) => ({
                value: type,
                label: type.replace(/_/g, ' '),
              }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input label="Titre" {...register('titre', { required: true })} />
            <Input label="Garage / prestataire" {...register('garage_prestataire')} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Input label="Date maintenance" type="date" {...register('date_maintenance', { required: true })} />
            <Input label="Heure début" type="time" {...register('heure_debut')} />
            <Input label="Heure fin" type="time" {...register('heure_fin')} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Input label="Coût (XAF)" type="number" {...register('cout')} />
            <Input label="KM à l'intervention" type="number" {...register('kilometrage_a_lintervention')} />
            <Input label="Prochain entretien (KM)" type="number" {...register('prochain_entretien_km')} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input label="Prochaine maintenance prévue" type="date" {...register('prochaine_maintenance_date')} />
            <SelectField
              label="Statut"
              registration={register('statut')}
              options={[
                { value: 'planifiee', label: 'planifiee' },
                { value: 'en_cours', label: 'en cours' },
                { value: 'terminee', label: 'terminee' },
                { value: 'annulee', label: 'annulee' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-cyprus">Description</label>
            <textarea {...register('description')} rows={4} className="rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-cyprus">Pièces remplacées</label>
              <textarea {...register('pieces_remplacees')} rows={3} className="rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-cyprus">Notes</label>
              <textarea {...register('notes')} rows={3} className="rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus" />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-sand-dark pt-4">
            <Button variant="outline" type="button" onClick={() => navigate('/maintenances')}>Annuler</Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>Enregistrer l'intervention</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const SelectField = ({ label, registration, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-cyprus">{label}</label>
    <select {...registration} className="rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus">
      <option value="">Sélectionner...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default MaintenanceForm;
