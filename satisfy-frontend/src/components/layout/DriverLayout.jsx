import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, Home, LogOut, UserCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { icon: Home, label: 'Accueil', path: '/chauffeur' },
  { icon: ClipboardList, label: 'Missions', path: '/chauffeur/missions' },
  { icon: UserCircle2, label: 'Profil', path: '/chauffeur/profil' },
];

export const DriverLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-cyprus text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-cyprus/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-kiwi/70">Espace Chauffeur</p>
            <h1 className="text-xl font-syne font-extrabold">
              {user?.nom_complet || user?.prenom || 'SATISFY'}
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-sand/80 transition-colors hover:text-red-300"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-cyprus/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/chauffeur'}
              className={({ isActive }) =>
                `flex min-w-20 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-bold transition-all ${
                  isActive ? 'bg-kiwi text-cyprus-dark' : 'text-sand/70'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
