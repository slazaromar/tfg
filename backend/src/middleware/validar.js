const { validationResult } = require('express-validator');

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ mensaje: 'Error de validación', errores: errores.array() });
  }
  next();
}

module.exports = validar;
