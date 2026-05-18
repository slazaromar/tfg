import api from './api';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const servicioAutenticacion = {
  async iniciarSesion(correo, contrasena) {
    const { data } = await api.post('/autenticacion/iniciar-sesion', { correo, contrasena });
    localStorage.setItem('tokenAcceso',   data.tokenAcceso);
    localStorage.setItem('tokenRefresco', data.tokenRefresco);
    return data;
  },

  async cerrarSesion() {
    const tokenRefresco = localStorage.getItem('tokenRefresco');
    try {
      await api.post('/autenticacion/cerrar-sesion', { tokenRefresco });
    } catch { /* ignorar */ }
    localStorage.removeItem('tokenAcceso');
    localStorage.removeItem('tokenRefresco');
    localStorage.removeItem('usuario');
  },

  async registrar(nombreUsuario, correo, contrasena) {
    const { data } = await api.post('/autenticacion/registrar', {
      nombre_usuario: nombreUsuario,
      correo,
      contrasena,
    });
    return data;
  },
};

export { API_URL };
export default servicioAutenticacion;
