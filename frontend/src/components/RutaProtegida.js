import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';

export default function RutaProtegida() {
  const { estaAutenticado, cargando } = usarAutenticacion();

  if (cargando) {
    return (
      <div className="loading-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
