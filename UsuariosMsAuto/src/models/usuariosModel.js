const mysql = require('mysql2/promise');


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',  //puerto establecido para sql
    database: 'UsuariosDBAuto'
});


// Obtener todos los usuarios
async function traerUsuarios() {
    const result = await connection.query('SELECT * FROM usuarios');
    return result[0];
}


// Consultar un usuario por ID
async function traerUsuarioPorId(id) {
    const result = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return result[0];
}


// Consultar un usuario por su nombre
async function traerUsuarioPorNombre(nombre) {
    const result = await connection.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
    return result[0];
}


// Validar si un usuario ya existe por su número de identificación
async function validarUsuarioPorIdentificacion(identificacion) {
    const result = await connection.query('SELECT * FROM usuarios WHERE identificacion = ?', [identificacion]);
    return result[0];
}


// Validar las credenciales de un usuario
async function validarUsuario(usuario, password) {
    const result = await connection.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [usuario, password]);
    return result[0];
}


// Crear un nuevo usuario
async function crearUsuario(nombre, email, identificacion, telefono, direccion, usuario, password) {
    const result = await connection.query(
        'INSERT INTO usuarios (nombre, email, identificacion, telefono, direccion, usuario, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, email, identificacion, telefono, direccion, usuario, password]
    );
    return result;
}


// Actualizar un usuario
async function actualizarUsuario(id, nombre, email, telefono, direccion, usuario, password) {
    const result = await connection.query(
        'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, usuario = ?, password = ? WHERE id = ?',
        [nombre, email, telefono, direccion, usuario, password, id]
    );
    return result;
}


// Borrar un usuario
async function borrarUsuario(id) {
    const result = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
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