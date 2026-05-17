import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { useAffectations } from '../../hooks/useAffectations';
import { formatters } from '../../utils/formatters';

const AffectationsPage = () => {
  const [statut, setStatut] = useState('');
  const { affectations, isLoading, cancelAffectation, isCancelling } = useAffectations(
    statut ? { statut } : {},
  );

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affectations"
        subtitle="Suivi opérationnel des missions chauffeurs et véhicules."
        action={
          <div className="flex gap-3">
            <Link to="/affectations/planning">
              <Button variant="outline" className="gap-2">
                <Calendar size={18} /> Voir le Planning
              </Button>
            </Link>
            <Link to="/affectations/nouveau">
              <Button className="gap-2">
                <Plus size={18} /> Nouvelle Affectation
              </Button>
            </Link>
          </div>
        }
      />

      <div className="max-w-xs rounded-2xl border border-sand-dark bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-cyprus">Filtrer par statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="w-full rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus"
        >
          <option value="">Toutes</option>
          <option value="planifiee">Planifiées</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminées</option>
          <option value="annulee">Annulées</option>
        </select>
      </div>

      <Table headers={['Mission', 'Chauffeur', 'Véhicule', 'Route', 'Départ', 'Statut', 'Actions']}>
        {affectations.map((affectation) => (
          <tr key={affectation.id} className="hover:bg-sand-light transition-colors">
            <td className="px-6 py-4 font-bold text-cyprus">#AFF-{affectation.id}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{affectation.driver?.user?.nom_complet || 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{affectation.vehicule?.libelle || 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-cyprus">{affectation.route?.trajet || 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-cyprus">
              {affectation.date_depart} {affectation.heure_depart ? `à ${affectation.heure_depart}` : ''}
            </td>
            <td className="px-6 py-4">
              <Badge variant={statusVariant(affectation.statut)}>
                {formatters.status(affectation.statut)}
              </Badge>
            </td>
            <td className="px-6 py-4">
              {['planifiee', 'en_cours'].includes(affectation.statut) ? (
                <Button
                  variant="ghost"
                  className="px-0 py-0 text-xs"
                  isLoading={isCancelling}
                  onClick={() => cancelAffectation({ id: affectation.id, raison: 'Annulation depuis le back-office' })}
                >
                  Annuler
                </Button>
              ) : (
                <span className="text-xs text-cyprus/50">Aucune action</span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

const statusVariant = (status) => {
  if (status === 'en_cours') return 'success';
  if (status === 'annulee') return 'danger';
  if (status === 'terminee') return 'info';
  return 'warning';
};

export default AffectationsPage;
