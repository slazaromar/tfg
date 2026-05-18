import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NoEncontrado() {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg)', padding: 24 }}>
      <div style={{ fontSize: '4rem' }}>⚽</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('notFound.title')}</h1>
      <p className="text-muted">{t('notFound.subtitle')}</p>
      <Link to="/panel" className="btn btn-primary btn-lg">{t('notFound.goDashboard')}</Link>
    </div>
  );
}
