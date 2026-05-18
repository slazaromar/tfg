import api from './api';

const servicioJugador = {
  obtenerTodos:    (parametros = {}) => api.get('/jugadores', { params: parametros }).then((r) => r.data),
  obtenerPorId:    (id)              => api.get(`/jugadores/${id}`).then((r) => r.data),
  crear:           (datos)           => api.post('/jugadores', datos).then((r) => r.data),
  actualizar:      (id, datos)       => api.put(`/jugadores/${id}`, datos).then((r) => r.data),
  eliminar:        (id)              => api.delete(`/jugadores/${id}`).then((r) => r.data),
  obtenerPorEquipo:(idEquipo)        => api.get(`/jugadores?equipoId=${idEquipo}`).then((r) => r.data),
};

export default servicioJugador;
