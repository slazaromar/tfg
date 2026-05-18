import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import servicioPartido from '../services/partido.servicio';
import servicioEquipo  from '../services/equipo.servicio';
import { Link }        from 'react-router-dom';
import { toast }       from 'react-toastify';

const INSIGNIA_ESTADO = {
  programado:  'badge-blue',
  en_curso:    'badge-yellow',
  finalizado:  'badge-green',
  cancelado:   'badge-gray',
};

const FORMULARIO_VACIO = {
  equipo_local_id: '', equipo_visitante_id: '',
  fecha_partido: '', competicion: '', estadio: '',
};

export default function Partidos() {
  const { t, i18n } = useTranslation();
  const [partidos, setPartidos]     = useState([]);
  const [equipos, setEquipos]       = useState([]);
  const [total, setTotal]           = useState(0);
  const [cargando, setCargando]     = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando]     = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando]   = useState(false);
  const [filtro, setFiltro]         = useState('');

  const cargarPartidos = useCallback(async () => {
    setCargando(true);
    try {
      const parametros = { limite: 50 };
      if (filtro) parametros.estado = filtro;
      const datos = await servicioPartido.obtenerTodos(parametros);
      setPartidos(datos.datos || []);
      setTotal(datos.total || 0);
    } finally { setCargando(false); }
  }, [filtro]);

  useEffect(() => { cargarPartidos(); }, [cargarPartidos]);
  useEffect(() => { servicioEquipo.obtenerTodos().then((d) => setEquipos(d.datos || [])); }, []);

  const abrirCrear = () => { setEditando(null); setFormulario(FORMULARIO_VACIO); setModalAbierto(true); };
  const abrirEditar = (p) => {
    setEditando(p);
    setFormulario({
      equipo_local_id: p.equipo_local_id, equipo_visitante_id: p.equipo_visitante_id,
      fecha_partido: p.fecha_partido ? p.fecha_partido.slice(0, 16) : '',
      competicion: p.competicion || '', estadio: p.estadio || '',
    });
    setModalAbierto(true);
  };

  const manejarGuardado = async (e) => {
    e.preventDefault();
    if (formulario.equipo_local_id === formulario.equipo_visitante_id) {
      toast.warning(t('matches.toast.differentTeams')); return;
    }
    setGuardando(true);
    try {
      if (editando) { await servicioPartido.actualizar(editando.id, formulario); toast.success(t('matches.toast.updated')); }
      else          { await servicioPartido.crear(formulario);                   toast.success(t('matches.toast.created')); }
      setModalAbierto(false); cargarPartidos();
    } catch { /* manejado */ } finally { setGuardando(false); }
  };

  const manejarEliminacion = async (id) => {
    if (!window.confirm(t('matches.toast.confirmDelete'))) return;
    try { await servicioPartido.eliminar(id); toast.success(t('matches.toast.deleted')); cargarPartidos(); } catch { /* manejado */ }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('matches.title')}</h1>
          <p className="page-subtitle">{t('matches.subtitle', { count: total })}</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>{t('matches.schedule')}</button>
      </div>

      {/* Filtro */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">{t('matches.allStatuses')}</option>
          {['programado','en_curso','finalizado','cancelado'].map((s) => <option key={s} value={s}>{t(`matches.status.${s}`)}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {cargando ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : partidos.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '48px 24px' }}>{t('matches.noResults')}</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('matches.th.dateTime')}</th>
                  <th>{t('matches.th.home')}</th>
                  <th>{t('matches.th.away')}</th>
                  <th>{t('matches.th.competition')}</th>
                  <th>{t('matches.th.venue')}</th>
                  <th>{t('matches.th.status')}</th>
                  <th>{t('matches.th.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {partidos.map((p) => (
                  <tr key={p.id}>
                    <td className="text-sm">
                      {new Date(p.fecha_partido).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.equipo_local?.nombre}</td>
                    <td style={{ fontWeight: 600 }}>{p.equipo_visitante?.nombre}</td>
                    <td className="text-sm text-muted">{p.competicion}</td>
                    <td className="text-sm text-muted">{p.estadio}</td>
                    <td><span className={`badge ${INSIGNIA_ESTADO[p.estado] || 'badge-gray'}`}>{t(`matches.status.${p.estado}`, p.estado)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/alineacion/${p.id}`} className="btn btn-primary btn-sm">{t('matches.lineupBtn')}</Link>
                        <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(p)}>{t('common.edit')}</button>
                        <button className="btn btn-danger btn-sm"    onClick={() => manejarEliminacion(p.id)}>{t('common.delete')}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480 }}>
            <h3 style={{ marginBottom: 20 }}>{editando ? t('matches.modal.editTitle') : t('matches.modal.addTitle')}</h3>
            <form onSubmit={manejarGuardado}>
              <div className="form-group">
                <label className="form-label">{t('matches.modal.homeTeam')}</label>
                <select className="form-select" required value={formulario.equipo_local_id} onChange={(e) => setFormulario({ ...formulario, equipo_local_id: e.target.value })}>
                  <option value="">{t('matches.modal.selectTeam')}</option>
                  {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('matches.modal.awayTeam')}</label>
                <select className="form-select" required value={formulario.equipo_visitante_id} onChange={(e) => setFormulario({ ...formulario, equipo_visitante_id: e.target.value })}>
                  <option value="">{t('matches.modal.selectTeam')}</option>
                  {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('matches.modal.dateTime')}</label>
                <input type="datetime-local" className="form-input" required value={formulario.fecha_partido} onChange={(e) => setFormulario({ ...formulario, fecha_partido: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('matches.modal.competition')}</label>
                <input className="form-input" placeholder={t('matches.modal.competitionPlaceholder')} value={formulario.competicion} onChange={(e) => setFormulario({ ...formulario, competicion: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('matches.modal.venue')}</label>
                <input className="form-input" placeholder={t('matches.modal.venuePlaceholder')} value={formulario.estadio} onChange={(e) => setFormulario({ ...formulario, estadio: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModalAbierto(false)}>{t('common.cancel')}</button>
                <button type="submit"  className="btn btn-primary"   style={{ flex: 1 }} disabled={guardando}>{guardando ? t('common.saving') : editando ? t('common.update') : t('common.create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
