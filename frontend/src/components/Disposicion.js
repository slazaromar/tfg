import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import SelectorIdioma from './SelectorIdioma';
import estilos from './Disposicion.module.css';

export default function Disposicion() {
  const { usuario, cerrarSesion } = usarAutenticacion();
  const { t } = useTranslation();
  const [menuAbierto, setMenuAbierto] = useState(true);

  const elementosNavegacion = [
    { to: '/panel',     label: t('nav.dashboard'), icon: '▪' },
    { to: '/partidos',  label: t('nav.matches'),   icon: '▪' },
    { to: '/jugadores', label: t('nav.players'),   icon: '▪' },
    { to: '/equipos',   label: t('nav.teams'),     icon: '▪' },
  ];

  return (
    <div className={estilos.shell}>
      {/* sidebar */}
      <aside className={`${estilos.sidebar} ${menuAbierto ? '' : estilos.collapsed}`}>
        <div className={estilos.sidebarLogo}>
          <span className={estilos.logoIcon} style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>TA</span>
          {menuAbierto && <span className={estilos.logoText}>{t('common.appName')}</span>}
        </div>

        <nav className={estilos.nav}>
          {elementosNavegacion.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${estilos.navItem} ${isActive ? estilos.navItemActive : ''}`
              }
            >
              <span className={estilos.navIcon}>{icon}</span>
              {menuAbierto && <span className={estilos.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          className={estilos.toggleBtn}
          onClick={() => setMenuAbierto((v) => !v)}
          title={t('nav.toggleSidebar')}
        >
          {menuAbierto ? '◀' : '▶'}
        </button>
      </aside>

      {/* contenido principal */}
      <div className={estilos.main}>
        {/* Barra superior */}
        <header className={estilos.topbar}>
          <div />
          <div className={estilos.userArea}>
            <SelectorIdioma />
            <span className={estilos.userInfo}>
              <strong>{usuario?.username}</strong>
              <span className="badge badge-blue" style={{ marginLeft: 8 }}>
                {usuario?.role}
              </span>
            </span>
            <button className="btn btn-secondary btn-sm" onClick={cerrarSesion}>
              {t('common.signOut')}
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className={estilos.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
