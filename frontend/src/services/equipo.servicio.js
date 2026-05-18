import api from './api';

const servicioEquipo = {
  obtenerTodos: (parametros = {}) => api.get('/equipos', { params: parametros }).then((r) => r.data),
  obtenerPorId: (id)              => api.get(`/equipos/${id}`).then((r) => r.data),
  crear:        (datos)           => api.post('/equipos', datos).then((r) => r.data),
  actualizar:   (id, datos)       => api.put(`/equipos/${id}`, datos).then((r) => r.data),
  eliminar:     (id)              => api.delete(`/equipos/${id}`).then((r) => r.data),
};

export default servicioEquipo;
