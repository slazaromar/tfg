const { consultar } = require('../config/baseDatos');

async function obtenerTodos(req, res, next) {
  try {
    const { limite = 50, desplazamiento = 0 } = req.query;
    const [resDatos, resConteo] = await Promise.all([
      consultar(`SELECT * FROM equipos ORDER BY nombre LIMIT $1 OFFSET $2`,
                [parseInt(limite), parseInt(desplazamiento)]),
      consultar(`SELECT COUNT(*) FROM equipos`),
    ]);
    res.json({ datos: resDatos.rows, total: parseInt(resConteo.rows[0].count) });
  } catch (err) { next(err); }
}

async function obtenerPorId(req, res, next) {
  try {
    const { rows } = await consultar(`SELECT * FROM equipos WHERE id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function crear(req, res, next) {
  try {
    const { nombre, nombre_corto, formacion, ciudad, pais } = req.body;
    const { rows } = await consultar(
      `INSERT INTO equipos (nombre, nombre_corto, formacion, ciudad, pais)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, nombre_corto || null, formacion || '4-3-3', ciudad || null, pais || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

async function actualizar(req, res, next) {
  try {
    const { nombre, nombre_corto, formacion, ciudad, pais } = req.body;
    const { rows } = await consultar(
      `UPDATE equipos SET nombre=$1, nombre_corto=$2, formacion=$3, ciudad=$4, pais=$5
       WHERE id=$6 RETURNING *`,
      [nombre, nombre_corto || null, formacion || '4-3-3', ciudad || null, pais || null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function eliminar(req, res, next) {
  try {
    const { rowCount } = await consultar(`DELETE FROM equipos WHERE id = $1`, [req.params.id]);
    if (!rowCount) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
