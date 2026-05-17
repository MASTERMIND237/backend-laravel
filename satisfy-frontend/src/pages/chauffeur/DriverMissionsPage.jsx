import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { useDriverActions, useDriverAffectations } from '../../hooks/useDriverPortal';

const DriverMissionsPage = () => {
  const [filters, setFilters] = useState({ statut: '' });
  const { data, isLoading } = useDriverAffectations(filters.statut ? { statut: filters.statut } : {});
  const { demarrerMission, terminerMission, isStartingMission, isFinishingMission } = useDriverActions();

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  const missions = data?.data || [];

  return (
    <div className="space-y-4">
      <Card title="Mes missions" className="border-white/10 bg-white text-cyprus-dark">
        <div className="mb-4 max-w-xs">
          <label className="mb-2 block text-sm font-medium text-cyprus">Filtrer par statut</label>
          <select
            value={filters.statut}
            onChange={(e) => setFilters({ statut: e.target.value })}
            className="w-full rounded-xl border-2 border-sand-dark px-4 py-2.5 outline-none focus:border-cyprus"
          >
            <option value="">Toutes</option>
            <option value="planifiee">Planifiées</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminées</option>
          </select>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className="rounded-2xl border border-sand-dark p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-cyprus/60">{mission.route?.trajet || 'Trajet'}</p>
                  <h3 className="font-syne text-lg font-bold">{mission.vehicule?.libelle || 'Véhicule'}</h3>
                  <p className="text-sm text-cyprus/70">
                    Départ prévu: {mission.date_depart} à {mission.heure_depart}
                  </p>
                </div>
                <Badge variant={mission.statut === 'en_cours' ? 'success' : 'info'}>{mission.statut}</Badge>
              </div>

              {mission.observations ? (
                <p className="mt-3 text-sm text-cyprus/70">{mission.observations}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                {mission.statut === 'planifiee' ? (
                  <Button isLoading={isStartingMission} onClick={() => demarrerMission(mission.id)}>
                    Démarrer
                  </Button>
                ) : null}
                {mission.statut === 'en_cours' ? (
                  <Button isLoading={isFinishingMission} onClick={() => terminerMission(mission.id)}>
                    Terminer
                  </Button>
                ) : null}
              </div>
            </div>
          ))}

          {!missions.length ? (
            <p className="text-sm text-cyprus/70">Aucune mission trouvée pour ce filtre.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default DriverMissionsPage;
