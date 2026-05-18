import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import servicioPartido    from '../services/partido.servicio';
import servicioEquipo     from '../services/equipo.servicio';
import servicioAlineacion from '../services/alineacion.servicio';
import MuestraAlineacion  from '../components/MuestraAlineacion';
import TarjetaJugador     from '../components/TarjetaJugador';
import { toast }          from 'react-toastify';

const FORMACIONES = ['4-3-3','4-4-2','4-2-3-1','3-5-2','5-3-2'];

export default function RecomendacionAlineacion() {
  const { t, i18n } = useTranslation();
  const { matchId: idPartido } = useParams();
  const [partido, setPartido]                       = useState(null);
  const [equipos, setEquipos]                       = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [formacion, setFormacion]                   = useState('4-3-3');
  const [alineacion, setAlineacion]                 = useState(null);
  const [cargando, setCargando]                     = useState(true);
  const [generando, setGenerando]                   = useState(false);
  const [guardando, setGuardando]                   = useState(false);
  const [vista, setVista]                           = useState('campo');

  useEffect(() => {
    Promise.all([
      servicioPartido.obtenerPorId(idPartido),
      servicioEquipo.obtenerTodos({ limite: 50 }),
    ]).then(([p, e]) => {
      setPartido(p);
      const equiposPartido = (e.datos || []).filter(
        (eq) => eq.id === p.equipo_local_id || eq.id === p.equipo_visitante_id
      );
      setEquipos(equiposPartido);
      if (equiposPartido.length > 0) {
        setEquipoSeleccionado(equiposPartido[0].id);
        setFormacion(equiposPartido[0].formacion || '4-3-3');
      }
    }).finally(() => setCargando(false));
  }, [idPartido]);

  const manejarGeneracion = async () => {
    if (!equipoSeleccionado) { toast.warning(t('lineup.selectTeamWarn')); return; }
    setGenerando(true);
    try {
      const datos = await servicioAlineacion.recomendar(idPartido, equipoSeleccionado, formacion);
      setAlineacion(datos);
      toast.success(t('lineup.generated'));
    } catch { /* manejado */ } finally { setGenerando(false); }
  };

  const manejarGuardado = async () => {
    if (!alineacion) return;
    setGuardando(true);
    try {
      await servicioAlineacion.guardar({
        partidoId:        idPartido,
        equipoId:         equipoSeleccionado,
        formacion,
        esRecomendacion:  true,
        jugadores:        alineacion.jugadores,
      });
      toast.success(t('lineup.saved'));
    } catch { /* manejado */ } finally { setGuardando(false); }
  };

  if (cargando) return <div className="loading-center"><div className="spinner" /></div>;
  if (!partido) return <div className="card text-center" style={{ padding: 48 }}>{t('lineup.matchNotFound')} <Link to="/partidos">{t('lineup.backToMatches')}</Link></div>;

  const equipoSeleccionadoObj = equipos.find((eq) => eq.id === equipoSeleccionado);

  return (
    <div>
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <Link to="/partidos" className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>{t('lineup.backToMatches')}</Link>
          <h1 className="page-title">{t('lineup.title')}</h1>
          <p className="page-subtitle">
            {partido.equipo_local?.nombre} <strong>{t('dashboard.vs')}</strong> {partido.equipo_visitante?.nombre}
            {partido.competicion && ` · ${partido.competicion}`}
            {' · '}
            {new Date(partido.fecha_partido).toLocaleDateString(i18n.language, { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>{t('lineup.configuration')}</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('lineup.team')}</label>
            <select
              className="form-select"
              value={equipoSeleccionado}
              onChange={(e) => {
                setEquipoSeleccionado(e.target.value);
                const eq = equipos.find((eq2) => eq2.id === e.target.value);
                if (eq?.formacion) setFormacion(eq.formacion);
              }}
            >
              {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('lineup.formation')}</label>
            <select className="form-select" value={formacion} onChange={(e) => setFormacion(e.target.value)}>
              {FORMACIONES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={manejarGeneracion}
            disabled={generando}
          >
            {generando
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> {t('lineup.generating')}</>
              : t('lineup.generate')}
          </button>

          {alineacion && (
            <button className="btn btn-secondary btn-lg" onClick={manejarGuardado} disabled={guardando}>
              {guardando ? t('common.saving') : t('lineup.saveLineup')}
            </button>
          )}
        </div>
      </div>

      {/* Explicación del algoritmo */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--primary)' }}>
        <h4 style={{ marginBottom: 10, color: 'var(--primary)' }}>{t('lineup.scoringTitle')}</h4>
        <p className="text-sm text-muted">
          <Trans i18nKey="lineup.scoringText" components={{ b: <strong /> }} />
        </p>
      </div>

      {/* Resultados */}
      {alineacion ? (
        <div>
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-value">{alineacion.jugadores?.filter((j) => j.es_titular).length}</div>
              <div className="stat-label">{t('lineup.starters')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{alineacion.jugadores?.filter((j) => !j.es_titular).length}</div>
              <div className="stat-label">{t('lineup.bench')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{alineacion.puntuacion_media != null ? Number(alineacion.puntuacion_media).toFixed(1) : '—'}</div>
              <div className="stat-label">{t('lineup.avgScore')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formacion}</div>
              <div className="stat-label">{t('lineup.formation')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className={`btn ${vista === 'campo' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setVista('campo')}>{t('lineup.pitchView')}</button>
            <button className={`btn ${vista === 'lista' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setVista('lista')}>{t('lineup.listView')}</button>
          </div>

          {vista === 'campo' ? (
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>
                {equipoSeleccionadoObj?.nombre} — {formacion}
              </h3>
              <MuestraAlineacion alineacion={alineacion} formacion={formacion} />
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: 16 }}>{t('lineup.startingXI')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12, marginBottom: 24 }}>
                {alineacion.jugadores?.filter((j) => j.es_titular).map((j, i) => (
                  <TarjetaJugador key={i} jugador={j} puntuacion={j.puntuacion_recomendacion} compacto />
                ))}
              </div>
              {alineacion.jugadores?.some((j) => !j.es_titular) && (
                <>
                  <h3 style={{ marginBottom: 16 }}>{t('lineup.benchHeader')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                    {alineacion.jugadores.filter((j) => !j.es_titular).map((j, i) => (
                      <TarjetaJugador key={i} jugador={j} puntuacion={j.puntuacion_recomendacion} compacto />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '64px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
          <p style={{ fontSize: '1.1rem' }}>
            <Trans i18nKey="lineup.emptyHint" components={{ b: <strong /> }} />
          </p>
        </div>
      )}
    </div>
  );
}
