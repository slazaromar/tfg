const router       = require('express').Router();
const { body }     = require('express-validator');
const ctrl         = require('../controllers/autenticacion.controlador');
const validar      = require('../middleware/validar');
const { autenticar } = require('../middleware/autenticacion');

router.post('/registrar',
  body('nombre_usuario').trim().isLength({ min: 3, max: 50 }),
  body('correo').isEmail().normalizeEmail(),
  body('contrasena').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*\d)/),
  validar, ctrl.registrar
);

router.post('/iniciar-sesion',
  body('correo').isEmail(),
  body('contrasena').notEmpty(),
  validar, ctrl.iniciarSesion
);

router.post('/refrescar',
  body('tokenRefresco').notEmpty(),
  validar, ctrl.refrescar
);

router.post('/cerrar-sesion', ctrl.cerrarSesion);

router.get('/yo', autenticar, ctrl.yo);

module.exports = router;
