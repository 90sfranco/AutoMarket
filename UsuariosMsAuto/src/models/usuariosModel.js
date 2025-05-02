const mysql = require('mysql2/promise');

// Configuración CORREGIDA usando variables de entorno
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'usuarios-db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'UsuariosDBAuto'
});


// Obtener todos los usuarios
async function traerUsuarios() {
    const result = await pool.query('SELECT * FROM usuarios');
    return result[0];
}


// Consultar un usuario por ID
async function traerUsuarioPorId(id) {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return result[0];
}


// Consultar un usuario por su nombre
async function traerUsuarioPorNombre(nombre) {
    const result = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
    return result[0];
}


// Validar si un usuario ya existe por su número de identificación
async function validarUsuarioPorIdentificacion(identificacion) {
    const result = await pool.query('SELECT * FROM usuarios WHERE identificacion = ?', [identificacion]);
    return result[0];
}


// Validar las credenciales de un usuario
async function validarUsuario(usuario, password) {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [usuario, password]);
    return result[0];
}


// Crear un nuevo usuario
async function crearUsuario(nombre, email, identificacion, telefono, direccion, usuario, password) {
    const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, identificacion, telefono, direccion, usuario, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, email, identificacion, telefono, direccion, usuario, password]
    );
    return result;
}


// Actualizar un usuario
async function actualizarUsuario(id, nombre, email, telefono, direccion, usuario, password) {
    const [result] = await pool.query(
        'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, usuario = ?, password = ? WHERE id = ?',
        [nombre, email, telefono, direccion, usuario, password, id]
    );
    return result;
}


// Borrar un usuario
async function borrarUsuario(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
}


module.exports = {
    traerUsuarios,
    traerUsuarioPorId,
    traerUsuarioPorNombre,
    validarUsuarioPorIdentificacion,
    validarUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};