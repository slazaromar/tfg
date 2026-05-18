import api from './api';

const servicioAlineacion = {
  recomendar: (idPartido, idEquipo, formacion) =>
    api.post('/alineaciones/recomendar', { partidoId: idPartido, equipoId: idEquipo, formacion })
       .then((r) => r.data),

  guardar: (datos) =>
    api.post('/alineaciones', datos).then((r) => r.data),

  obtenerPorPartido: (idPartido) =>
    api.get(`/alineaciones?partidoId=${idPartido}`).then((r) => r.data),

  obtenerPorId: (id) =>
    api.get(`/alineaciones/${id}`).then((r) => r.data),
};

export default servicioAlineacion;
