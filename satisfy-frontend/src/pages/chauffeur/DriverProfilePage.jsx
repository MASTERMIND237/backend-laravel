import React from 'react';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { useDriverDashboard } from '../../hooks/useDriverPortal';

const DriverProfilePage = () => {
  const { data, isLoading } = useDriverDashboard();

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  const driver = data?.data;
  const user = driver?.user;

  return (
    <div className="space-y-4">
      <Card title="Mon profil" className="border-white/10 bg-white text-cyprus-dark">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileItem label="Nom complet" value={user?.nom_complet} />
          <ProfileItem label="Email" value={user?.email} />
          <ProfileItem label="Téléphone" value={user?.telephone} />
          <ProfileItem label="Ville" value={driver?.ville} />
          <ProfileItem label="Numéro de permis" value={driver?.numero_permis} />
          <ProfileItem label="Catégorie permis" value={driver?.categorie_permis} />
          <ProfileItem label="Date expiration permis" value={driver?.date_expiration_permis} />
          <ProfileItem label="Expérience" value={driver?.annees_experience != null ? `${driver.annees_experience} an(s)` : null} />
        </div>
      </Card>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="rounded-2xl border border-sand-dark p-4">
    <p className="text-xs font-bold uppercase tracking-wide text-cyprus/40">{label}</p>
    <p className="mt-1 font-medium text-cyprus">{value || 'Non renseigné'}</p>
  </div>
);

export default DriverProfilePage;
