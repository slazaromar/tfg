const registrador = require('../config/registrador');

function gestionErrores(err, req, res, _next) {
  registrador.error(`${req.method} ${req.path} — ${err.message}`, {
    stack:  err.stack,
    status: err.status,
  });

  if (err.code === '23505') {
    return res.status(409).json({ mensaje: 'Ya existe un registro con esos datos' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ mensaje: 'El registro referenciado no existe' });
  }

  const estado  = err.status  || 500;
  const mensaje = err.message || 'Error interno del servidor';

  res.status(estado).json({
    mensaje,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = gestionErrores;
