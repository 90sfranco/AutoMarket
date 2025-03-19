const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');

// Obtener todos los usuarios
router.get('/usuarios/all', async (req, res) => {
    var result = await usuariosModel.traerUsuarios();
    res.json(result);
});


// Consultar un usuario por ID
router.get('/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    var result = await usuariosModel.traerUsuarioPorId(id);
    res.json(result[0]);
});


// Consultar un usuario por su nombre
router.get('/usuarios/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    var result = await usuariosModel.traerUsuarioPorNombre(nombre);
    res.json(result[0]);
});


// Validar la creación de un nuevo usuario por su número de identificación (valida si un user ya existe ese num de indentificación)
router.get('/usuarios/validate/:identificacion', async (req, res) => {
    const identificacion = req.params.identificacion;
    var result = await usuariosModel.validarUsuarioPorIdentificacion(identificacion);
    if (result.length > 0) {
        return res.status(400).send("El usuario ya existe.");
    }
    res.send("El usuario puede ser creado.");
});


// Validar las credenciales de un usuario al intentar loguearse
router.post('/usuarios/login', async (req, res) => {
    const { usuario, password } = req.body;
    var result = await usuariosModel.validarUsuario(usuario, password);
    if (result.length > 0) {
        res.json(result[0]);
    } else {
        res.status(401).send("Credenciales incorrectas.");
    }
});


// Crear un nuevo usuario
router.post('/usuarios/create', async (req, res) => {
    const { nombre, email, identificacion, telefono, direccion, usuario, password } = req.body;


    // Validar si el número de identificación ya está registrado
    var resultValidacion = await usuariosModel.validarUsuarioPorIdentificacion(identificacion);
    if (resultValidacion.length > 0) {
        return res.status(400).send("El usuario con este número de identificación ya existe.");
    }


    var result = await usuariosModel.crearUsuario(nombre, email, identificacion, telefono, direccion, usuario, password);
    res.send("Usuario creado exitosamente.");
});


// Actualizar un usuario
router.put('/usuarios/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, email, telefono, direccion, usuario, password } = req.body;


    var result = await usuariosModel.actualizarUsuario(id, nombre, email, telefono, direccion, usuario, password);
    if (result.affectedRows > 0) {
        res.send("Usuario actualizado exitosamente.");
    } else {
        res.status(404).send("Usuario no encontrado.");
    }
});


// Borrar un usuario
router.delete('/usuarios/delete/:id', async (req, res) => {
    const id = req.params.id;


    var result = await usuariosModel.borrarUsuario(id);
    if (result.affectedRows > 0) {
        res.send("Usuario eliminado exitosamente.");
    } else {
        res.status(404).send("Usuario no encontrado.");
    }
});


module.exports = router;