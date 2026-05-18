const { Pool, types } = require('pg');
const registrador    = require('./registrador');


types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'tacticai',
  user:     process.env.DB_USER     || 'tacticai_user',
  password: process.env.DB_PASSWORD || 'tacticai_password',
  max:               20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function conectarBD() {
  const cliente = await pool.connect();
  await cliente.query('SELECT 1');
  cliente.release();
  registrador.info('✅ PostgreSQL conectado');
}

async function consultar(texto, parametros) {
  const inicio = Date.now();
  const resultado = await pool.query(texto, parametros);
  const duracion = Date.now() - inicio;
  registrador.debug(`SQL [${duracion}ms] ${texto.slice(0, 80)}`);
  return resultado;
}

function obtenerCliente() {
  return pool.connect();
}

module.exports = { conectarBD, consultar, obtenerCliente, pool };
