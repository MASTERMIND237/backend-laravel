import React from 'react';
import { Calendar, CheckCircle2, Plus, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { formatters } from '../../utils/formatters';
import { useMaintenances } from '../../hooks/useMaintenances';

const MaintenancesPage = () => {
  const { maintenances, maintenanceStats, isLoading } = useMaintenances();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  }

  const alertes = maintenances.filter((item) => item.statut === 'en_cours').length;
  const aVenir = maintenances.filter((item) => item.statut === 'planifiee').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entretiens & Maintenances"
        subtitle="Suivi technique des véhicules et anticipation des immobilisations."
        action={
          <Link to="/maintenances/nouveau">
            <Button className="gap-2">
              <Plus size={18} /> Programmer un entretien
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard icon={<Wrench size={24} />} label="En cours" value={`${alertes} intervention(s)`} />
        <SummaryCard icon={<Calendar size={24} />} label="Planifiées" value={`${aVenir} à venir`} />
        <SummaryCard
          icon={<CheckCircle2 size={24} />}
          label="Coût annuel"
          value={formatters.currency(maintenanceStats?.cout_total_annee || 0)}
        />
      </div>

      <Table headers={['Véhicule', 'Titre', 'Type', 'Date', 'Coût', 'Statut']}>
        {maintenances.map((maintenance) => (
          <tr key={maintenance.id} className="hover:bg-sand-light transition-colors">
            <td className="px-6 py-4 font-bold text-cyprus">{maintenance.vehicule?.libelle || 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{maintenance.titre}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{formatters.status(maintenance.type_maintenance)}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{maintenance.date_maintenance}</td>
            <td className="px-6 py-4 text-sm font-bold text-cyprus">{maintenance.cout}</td>
            <td className="px-6 py-4">
              <Badge variant={statusVariant(maintenance.statut)}>
                {formatters.status(maintenance.statut)}
              </Badge>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-sand-dark bg-white p-4">
    <div className="rounded-xl bg-sand p-3 text-cyprus">{icon}</div>
    <div>
      <p className="text-xs font-bold uppercase text-cyprus/40">{label}</p>
      <p className="text-xl font-bold text-cyprus">{value}</p>
    </div>
  </div>
);

const statusVariant = (status) => {
  if (status === 'terminee') return 'success';
  if (status === 'en_cours') return 'warning';
  if (status === 'annulee') return 'danger';
  return 'info';
};

export default MaintenancesPage;
