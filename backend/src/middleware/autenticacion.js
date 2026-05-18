const jwt          = require('jsonwebtoken');
const registrador  = require('../config/registrador');

function autenticar(req, res, next) {
  const cabecera = req.headers.authorization;
  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No se ha proporcionado token' });
  }

  const token = cabecera.split(' ')[1];
  try {
    const carga = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = carga;
    next();
  } catch (err) {
    registrador.debug(`Verificación JWT fallida: ${err.message}`);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token caducado' });
    }
    return res.status(401).json({ mensaje: 'Token no válido' });
  }
}


function autorizar(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Permisos insuficientes' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
