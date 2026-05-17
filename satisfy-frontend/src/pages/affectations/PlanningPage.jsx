import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/layout/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { usePlanning } from '../../hooks/useAffectations';

const PlanningPage = () => {
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week').add(1, 'day'));

  const params = useMemo(
    () => ({
      date_debut: weekStart.format('YYYY-MM-DD'),
      date_fin: weekStart.add(6, 'day').format('YYYY-MM-DD'),
    }),
    [weekStart],
  );

  const { data, isLoading } = usePlanning(params);
  const planning = data?.data || {};
  const days = Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day'));

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Planning Hebdomadaire" subtitle="Vue d’ensemble des départs planifiés et en cours." />

      <Card>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="rounded-lg p-2 hover:bg-sand" onClick={() => setWeekStart((value) => value.subtract(7, 'day'))}>
              <ChevronLeft size={20} />
            </button>
            <h3 className="self-center text-lg font-bold text-cyprus">
              {weekStart.format('DD MMM')} - {weekStart.add(6, 'day').format('DD MMM YYYY')}
            </h3>
            <button className="rounded-lg p-2 hover:bg-sand" onClick={() => setWeekStart((value) => value.add(7, 'day'))}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {days.map((day) => {
            const key = day.format('YYYY-MM-DD');
            const missions = planning[key]?.data || [];

            return (
              <div key={key} className="rounded-2xl border border-sand-dark p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-syne text-lg font-bold text-cyprus">
                    {day.format('dddd DD MMMM')}
                  </h4>
                  <span className="text-xs font-bold uppercase text-cyprus/50">
                    {missions.length} mission(s)
                  </span>
                </div>

                {missions.length ? (
                  <div className="space-y-3">
                    {missions.map((mission) => (
                      <div key={mission.id} className="rounded-xl bg-sand p-3">
                        <p className="font-bold text-cyprus">{mission.route?.trajet || 'Trajet'}</p>
                        <p className="text-sm text-cyprus/70">
                          {mission.heure_depart} • {mission.driver?.user?.nom_complet || 'Chauffeur'} • {mission.vehicule?.libelle || 'Véhicule'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-cyprus/60">Aucune affectation ce jour-là.</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PlanningPage;
