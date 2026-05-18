import api from './api';

const servicioPartido = {
  obtenerTodos: (parametros = {}) => api.get('/partidos', { params: parametros }).then((r) => r.data),
  obtenerPorId: (id)              => api.get(`/partidos/${id}`).then((r) => r.data),
  crear:        (datos)           => api.post('/partidos', datos).then((r) => r.data),
  actualizar:   (id, datos)       => api.put(`/partidos/${id}`, datos).then((r) => r.data),
  eliminar:     (id)              => api.delete(`/partidos/${id}`).then((r) => r.data),
};

export default servicioPartido;
