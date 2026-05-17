import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { useDriverActions, useDriverDashboard } from '../../hooks/useDriverPortal';

const DriverHomePage = () => {
  const { data, isLoading } = useDriverDashboard();
  const { demarrerMission, terminerMission, isStartingMission, isFinishingMission } = useDriverActions();

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  const driver = data?.data;
  const mission = driver?.affectation_du_jour;
  const prochaines = driver?.prochaines_affectations || [];
  const rapportsEnAttente = driver?.rapports_en_attente || [];

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-white/5 text-white">
        <div className="space-y-2">
          <p className="text-sm text-sand/70">Bienvenue sur votre espace conducteur.</p>
          <h2 className="text-2xl font-syne font-extrabold">
            {driver?.user?.nom_complet || 'Chauffeur'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant={driver?.statut === 'actif' ? 'success' : 'neutral'}>{driver?.statut || 'inconnu'}</Badge>
            <Badge variant="info">{driver?.categorie_permis ? `Permis ${driver.categorie_permis}` : 'Permis non renseigné'}</Badge>
          </div>
        </div>
      </Card>

      <Card title="Mission du jour" className="border-white/10 bg-white text-cyprus-dark">
        {mission ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-cyprus/60">{mission.route?.trajet || 'Trajet'}</p>
              <h3 className="text-xl font-syne font-bold">{mission.vehicule?.libelle || 'Véhicule'}</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-cyprus/70">
              <span>Départ: {mission.date_depart} à {mission.heure_depart}</span>
              <span>Statut: {mission.statut}</span>
            </div>
            <div className="flex gap-3">
              {mission.statut === 'planifiee' ? (
                <Button isLoading={isStartingMission} onClick={() => demarrerMission(mission.id)}>
                  Démarrer la mission
                </Button>
              ) : null}
              {mission.statut === 'en_cours' ? (
                <Button isLoading={isFinishingMission} onClick={() => terminerMission(mission.id)}>
                  Terminer la mission
                </Button>
              ) : null}
              <Link to="/chauffeur/missions">
                <Button variant="outline">Voir toutes mes missions</Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cyprus/70">Aucune mission planifiée aujourd’hui.</p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Prochaines missions" className="border-white/10 bg-white text-cyprus-dark">
          {prochaines.length ? (
            <div className="space-y-3">
              {prochaines.slice(0, 3).map((affectation) => (
                <div key={affectation.id} className="rounded-2xl border border-sand-dark p-3">
                  <p className="font-bold">{affectation.route?.trajet || 'Trajet'}</p>
                  <p className="text-sm text-cyprus/60">{affectation.date_depart} à {affectation.heure_depart}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyprus/70">Aucune mission à venir sur 7 jours.</p>
          )}
        </Card>

        <Card title="Rapports à soumettre" className="border-white/10 bg-white text-cyprus-dark">
          {rapportsEnAttente.length ? (
            <div className="space-y-3">
              {rapportsEnAttente.map((affectation) => (
                <div key={affectation.id} className="rounded-2xl border border-sand-dark p-3">
                  <p className="font-bold">{affectation.route?.trajet || 'Mission terminée'}</p>
                  <p className="text-sm text-cyprus/60">Mission du {affectation.date_depart}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cyprus/70">Aucun rapport en attente.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DriverHomePage;
