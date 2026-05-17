import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { KmChart } from '../../components/charts/KmChart';
import { DescriptionItem } from '../../components/ui/DescriptionList';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { formatters } from '../../utils/formatters';
import { useRapports } from '../../hooks/useRapports';

const RapportsPage = () => {
  const { rapports, rapportStats, isLoading, validateRapport } = useRapports();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  }

  const parMois = (rapportStats?.par_mois || []).map((item) => ({
    name: `M${item.mois}`,
    km: Number(item.km_total || 0),
  }));

  const topVehicules = (rapportStats?.km_par_vehicule || []).slice(0, 5);
  const enAttente = rapports.filter((rapport) => rapport.statut_validation === 'en_attente');

  return (
    <div className="space-y-8">
      <PageHeader title="Rapports d'Activité" subtitle="Vision kilométrique, carburant et validation terrain." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Évolution du kilométrage validé">
            <KmChart data={parMois} />
          </Card>

          <Card title="Rapports en attente de validation">
            <Table headers={['Date', 'Chauffeur', 'Véhicule', 'KM', 'Action']}>
              {enAttente.map((rapport) => (
                <tr key={rapport.id} className="hover:bg-sand-light transition-colors">
                  <td className="px-6 py-4 text-sm text-cyprus">{rapport.date_rapport}</td>
                  <td className="px-6 py-4 text-sm text-cyprus">{rapport.driver?.user?.nom_complet || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-cyprus">{rapport.vehicule?.libelle || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-cyprus">{rapport.kilometrage?.parcouru || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" className="px-0 py-0 text-xs" onClick={() => validateRapport(rapport.id)}>
                      Valider
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Récapitulatif Annuel" className="border-none bg-cyprus text-white">
            <div className="space-y-4">
              <Metric label="Distance totale" value={`${Number(rapportStats?.km_total || 0).toLocaleString()} km`} />
              <Metric label="Carburant consommé" value={`${Number(rapportStats?.carburant_total_litres || 0).toLocaleString()} L`} />
              <Metric label="Coût carburant" value={formatters.currency(rapportStats?.cout_carburant_total || 0)} />
              <Metric label="Passagers transportés" value={Number(rapportStats?.total_passagers || 0).toLocaleString()} />
            </div>
          </Card>

          <Card title="Top véhicules">
            {topVehicules.length ? (
              topVehicules.map((item) => (
                <DescriptionItem
                  key={item.vehicle_id}
                  label={item.vehicule?.immatriculation || item.vehicule?.modele || 'Véhicule'}
                  value={`${Number(item.km_total || 0).toLocaleString()} km`}
                  subValue={item.vehicule?.marque || ''}
                />
              ))
            ) : (
              <p className="text-sm text-cyprus/60">Aucune donnée disponible.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase opacity-60">{label}</p>
    <p className="text-2xl font-syne font-bold">{value}</p>
  </div>
);

export default RapportsPage;
