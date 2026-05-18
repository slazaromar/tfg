import React from 'react';
import { useTranslation } from 'react-i18next';

// Coordenadas (% de ancho/alto del campo) por formación
const POSICIONES_FORMACION = {
  '4-3-3': [
    { pos: 'PO',  x: 50,  y: 92, label: 'PO' },
    { pos: 'LI',  x: 10,  y: 72, label: 'LI' },
    { pos: 'DFC', x: 35,  y: 76, label: 'DFC' },
    { pos: 'DFC', x: 65,  y: 76, label: 'DFC' },
    { pos: 'LD',  x: 90,  y: 72, label: 'LD' },
    { pos: 'MC',  x: 20,  y: 52, label: 'MC' },
    { pos: 'MC',  x: 50,  y: 48, label: 'MC' },
    { pos: 'MC',  x: 80,  y: 52, label: 'MC' },
    { pos: 'EI',  x: 15,  y: 24, label: 'EI' },
    { pos: 'DC',  x: 50,  y: 20, label: 'DC' },
    { pos: 'ED',  x: 85,  y: 24, label: 'ED' },
  ],
  '4-4-2': [
    { pos: 'PO',  x: 50,  y: 92, label: 'PO' },
    { pos: 'LI',  x: 10,  y: 72, label: 'LI' },
    { pos: 'DFC', x: 35,  y: 76, label: 'DFC' },
    { pos: 'DFC', x: 65,  y: 76, label: 'DFC' },
    { pos: 'LD',  x: 90,  y: 72, label: 'LD' },
    { pos: 'MI',  x: 10,  y: 50, label: 'MI' },
    { pos: 'MC',  x: 35,  y: 52, label: 'MC' },
    { pos: 'MC',  x: 65,  y: 52, label: 'MC' },
    { pos: 'MD',  x: 90,  y: 50, label: 'MD' },
    { pos: 'DC',  x: 35,  y: 22, label: 'DC' },
    { pos: 'DC',  x: 65,  y: 22, label: 'DC' },
  ],
  '4-2-3-1': [
    { pos: 'PO',  x: 50,  y: 92, label: 'PO' },
    { pos: 'LI',  x: 10,  y: 72, label: 'LI' },
    { pos: 'DFC', x: 35,  y: 76, label: 'DFC' },
    { pos: 'DFC', x: 65,  y: 76, label: 'DFC' },
    { pos: 'LD',  x: 90,  y: 72, label: 'LD' },
    { pos: 'MCD', x: 35,  y: 58, label: 'MCD' },
    { pos: 'MCD', x: 65,  y: 58, label: 'MCD' },
    { pos: 'MI',  x: 15,  y: 38, label: 'MI' },
    { pos: 'MCO', x: 50,  y: 36, label: 'MCO' },
    { pos: 'MD',  x: 85,  y: 38, label: 'MD' },
    { pos: 'DC',  x: 50,  y: 16, label: 'DC' },
  ],
};

const COLOR_PUNTUACION = (puntuacion) => {
  if (!puntuacion) return '#94a3b8';
  if (puntuacion >= 75) return '#22c55e';
  if (puntuacion >= 55) return '#f59e0b';
  return '#ef4444';
};

export default function MuestraAlineacion({ alineacion, formacion = '4-3-3' }) {
  const { t } = useTranslation();
  if (!alineacion || !alineacion.jugadores) return null;

  const posiciones = POSICIONES_FORMACION[formacion] || POSICIONES_FORMACION['4-3-3'];
  const titulares  = alineacion.jugadores.filter((j) => j.es_titular);

  // Asignar titulares a las posiciones
  const contadorPos = {};
  const posicionados = posiciones.map((pos) => {
    contadorPos[pos.pos] = (contadorPos[pos.pos] || 0);
    const candidatos = titulares.filter((j) => j.posicion === pos.pos || j.posicion_alineacion === pos.pos);
    const jugador = candidatos[contadorPos[pos.pos]] || null;
    contadorPos[pos.pos]++;
    return { ...pos, jugador };
  });

  return (
    <div>
      {/* Campo */}
      <div className="pitch" style={{ height: 480, marginBottom: 24 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <rect x="25" y="80" width="50" height="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <rect x="25" y="2"  width="50" height="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <rect x="37" y="90" width="26" height="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <rect x="37" y="0"  width="26" height="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
        </svg>

        {posicionados.map((pos, idx) => (
          <div key={idx} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: pos.jugador ? COLOR_PUNTUACION(pos.jugador.puntuacion_recomendacion) : 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', margin: '0 auto',
              boxShadow: pos.jugador ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
            }}>
              {pos.jugador ? pos.jugador.nombre?.split(' ').pop()?.slice(0,3).toUpperCase() : '+'}
            </div>
            <div style={{ fontSize: '0.65rem', marginTop: 3, fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pos.jugador ? pos.jugador.nombre?.split(' ').pop() : pos.label}
            </div>
            {pos.jugador?.puntuacion_recomendacion != null && (
              <div style={{ fontSize: '0.6rem', color: COLOR_PUNTUACION(pos.jugador.puntuacion_recomendacion), fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {Number(pos.jugador.puntuacion_recomendacion).toFixed(0)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Banquillo */}
      {alineacion.jugadores.filter((j) => !j.es_titular).length > 0 && (
        <div>
          <h4 style={{ marginBottom: 12, color: 'var(--text-muted)' }}>{t('lineup.benchHeader')}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {alineacion.jugadores.filter((j) => !j.es_titular).map((j, i) => (
              <div key={i} className="card" style={{ padding: '10px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{j.nombre}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{j.posicion_alineacion || j.posicion}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
