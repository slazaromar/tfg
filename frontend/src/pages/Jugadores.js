import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import servicioJugador from '../services/jugador.servicio';
import servicioEquipo  from '../services/equipo.servicio';
import TarjetaJugador  from '../components/TarjetaJugador';
import { toast }       from 'react-toastify';

const POSICIONES = ['ALL','GK','CB','LB','RB','CDM','CM','CAM','LM','RM','LW','RW','CF','ST'];

const FORMULARIO_VACIO = {
  nombre: '', posicion: 'CM', equipo_id: '', rol_equipo: 'rotacion',
  edad: '', nacionalidad: '', contrato_hasta: '',
  puntuacion_forma: '', puntuacion_general: '',
};

export default function Jugadores() {
  const { t } = useTranslation();
  const [jugadores, setJugadores]           = useState([]);
  const [equipos, setEquipos]               = useState([]);
  const [total, setTotal]                   = useState(0);
  const [cargando, setCargando]             = useState(true);
  const [busqueda, setBusqueda]             = useState('');
  const [filtroPosicion, setFiltroPosicion] = useState('ALL');
  const [filtroEquipo, setFiltroEquipo]     = useState('');
  const [modalAbierto, setModalAbierto]     = useState(false);
  const [editando, setEditando]             = useState(null);
  const [formulario, setFormulario]         = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando]           = useState(false);

  const cargarJugadores = useCallback(async () => {
    setCargando(true);
    try {
      const parametros = { limite: 50 };
      if (filtroPosicion !== 'ALL') parametros.posicion = filtroPosicion;
      if (filtroEquipo)             parametros.equipoId = filtroEquipo;
      if (busqueda)                 parametros.busqueda = busqueda;
      const datos = await servicioJugador.obtenerTodos(parametros);
      setJugadores(datos.datos || []);
      setTotal(datos.total || 0);
    } finally {
      setCargando(false);
    }
  }, [filtroPosicion, filtroEquipo, busqueda]);

  useEffect(() => { cargarJugadores(); }, [cargarJugadores]);
  useEffect(() => { servicioEquipo.obtenerTodos().then((d) => setEquipos(d.datos || [])); }, []);

  const abrirCrear = () => { setEditando(null); setFormulario(FORMULARIO_VACIO); setModalAbierto(true); };
  const abrirEditar = (j) => {
    setEditando(j);
    setFormulario({
      nombre: j.nombre, posicion: j.posicion, equipo_id: j.equipo_id || '',
      rol_equipo: j.rol_equipo, edad: j.edad || '', nacionalidad: j.nacionalidad || '',
      contrato_hasta: j.contrato_hasta ? j.contrato_hasta.slice(0,10) : '',
      puntuacion_forma: j.puntuacion_forma || '', puntuacion_general: j.puntuacion_general || '',
    });
    setModalAbierto(true);
  };

  const manejarGuardado = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await servicioJugador.actualizar(editando.id, formulario);
        toast.success(t('players.toast.updated'));
      } else {
        await servicioJugador.crear(formulario);
        toast.success(t('players.toast.created'));
      }
      setModalAbierto(false);
      cargarJugadores();
    } catch { /* el interceptor ya muestra el toast */ } finally {
      setGuardando(false);
    }
  };

  const manejarEliminacion = async (id) => {
    if (!window.confirm(t('players.toast.confirmDelete'))) return;
    try {
      await servicioJugador.eliminar(id);
      toast.success(t('players.toast.deleted'));
      cargarJugadores();
    } catch { /* manejado */ }
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('players.title')}</h1>
          <p className="page-subtitle">{t('players.subtitle', { count: total })}</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>{t('players.addPlayer')}</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 260 }} placeholder={t('players.searchPlaceholder')} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select className="form-select" value={filtroPosicion} onChange={(e) => setFiltroPosicion(e.target.value)}>
          {POSICIONES.map((p) => <option key={p} value={p}>{p === 'ALL' ? t('common.all') : p}</option>)}
        </select>
        <select className="form-select" value={filtroEquipo} onChange={(e) => setFiltroEquipo(e.target.value)}>
          <option value="">{t('players.allTeams')}</option>
          {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
        </select>
      </div>

      {/* Cuadrícula */}
      {cargando ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : jugadores.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px 24px' }}>
          <p className="text-muted">{t('players.noResults')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {jugadores.map((j) => (
            <div key={j.id} style={{ position: 'relative' }}>
              <TarjetaJugador jugador={j} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => abrirEditar(j)}>{t('common.edit')}</button>
                <button className="btn btn-danger btn-sm"    onClick={() => manejarEliminacion(j.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: 20 }}>{editando ? t('players.modal.editTitle') : t('players.modal.addTitle')}</h3>
            <form onSubmit={manejarGuardado}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">{t('players.modal.name')}</label>
                  <input className="form-input" required value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.position')}</label>
                  <select className="form-select" value={formulario.posicion} onChange={(e) => setFormulario({ ...formulario, posicion: e.target.value })}>
                    {POSICIONES.filter((p) => p !== 'ALL').map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.teamRole')}</label>
                  <select className="form-select" value={formulario.rol_equipo} onChange={(e) => setFormulario({ ...formulario, rol_equipo: e.target.value })}>
                    {['titular','rotacion','reserva','cantera'].map((r) => <option key={r} value={r}>{t(`players.roles.${r}`)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.team')}</label>
                  <select className="form-select" value={formulario.equipo_id} onChange={(e) => setFormulario({ ...formulario, equipo_id: e.target.value })}>
                    <option value="">{t('players.modal.noTeam')}</option>
                    {equipos.map((eq) => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.age')}</label>
                  <input type="number" className="form-input" min="15" max="45" value={formulario.edad} onChange={(e) => setFormulario({ ...formulario, edad: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.nationality')}</label>
                  <input className="form-input" value={formulario.nacionalidad} onChange={(e) => setFormulario({ ...formulario, nacionalidad: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.contractUntil')}</label>
                  <input type="date" className="form-input" value={formulario.contrato_hasta} onChange={(e) => setFormulario({ ...formulario, contrato_hasta: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.formRating')}</label>
                  <input type="number" className="form-input" min="1" max="10" step="0.1" value={formulario.puntuacion_forma} onChange={(e) => setFormulario({ ...formulario, puntuacion_forma: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('players.modal.overallRating')}</label>
                  <input type="number" className="form-input" min="1" max="100" value={formulario.puntuacion_general} onChange={(e) => setFormulario({ ...formulario, puntuacion_general: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModalAbierto(false)}>{t('common.cancel')}</button>
                <button type="submit"  className="btn btn-primary"   style={{ flex: 1 }} disabled={guardando}>
                  {guardando ? t('common.saving') : editando ? t('common.update') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
