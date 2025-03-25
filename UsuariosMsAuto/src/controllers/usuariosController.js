const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');

// Obtener todos los usuarios
router.get('/usuarios/all', async (req, res) => {
    try {
        const result = await usuariosModel.traerUsuarios();
        res.json(result);
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Consultar un usuario por ID
router.get('/usuarios/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await usuariosModel.traerUsuarioPorId(id);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send("Usuario no encontrado.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});


// Validar la creación de un nuevo usuario por su número de identificación
router.get('/usuarios/validate/:identificacion', async (req, res) => {
    try {
        const identificacion = req.params.identificacion;
        const result = await usuariosModel.validarUsuarioPorIdentificacion(identificacion);
        if (result.length > 0) {
            return res.status(400).send("El usuario ya existe.");
        }
        res.send("El usuario puede ser creado.");
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Validar las credenciales de un usuario al intentar loguearse
router.post('/usuarios/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const result = await usuariosModel.validarUsuario(usuario, password);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(401).send("Credenciales incorrectas.");
            console.log(`Usuario: ${usuario}`);
            console.log(`Password: ${password}`);
            
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Crear un nuevo usuario
router.post('/usuarios/create', async (req, res) => {
    try {
        const { nombre, email, identificacion, telefono, direccion, usuario, password } = req.body;

        // Validar si el número de identificación ya está registrado
        const resultValidacion = await usuariosModel.validarUsuarioPorIdentificacion(identificacion);
        if (resultValidacion.length > 0) {
            return res.status(400).send("El usuario con este número de identificación ya existe.");
        }

        await usuariosModel.crearUsuario(nombre, email, identificacion, telefono, direccion, usuario, password);
        res.send("Usuario creado exitosamente.");
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Actualizar un usuario
router.put('/usuarios/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, email, telefono, direccion, usuario, password } = req.body;

        // Validar que el usuario exista
        const usuarioExistente = await usuariosModel.traerUsuarioPorId(id);
        if (!usuarioExistente || usuarioExistente.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const result = await usuariosModel.actualizarUsuario(id, nombre, email, telefono, direccion, usuario, password);
        if (result.affectedRows > 0) {
            res.send("Usuario actualizado exitosamente.");
        } else {
            res.status(404).send("No se pudo actualizar el usuario.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Borrar un usuario
router.delete('/usuarios/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validar que el usuario exista
        const usuarioExistente = await usuariosModel.traerUsuarioPorId(id);
        if (!usuarioExistente || usuarioExistente.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const result = await usuariosModel.borrarUsuario(id);
        if (result.affectedRows > 0) {
            res.send("Usuario eliminado exitosamente.");
        } else {
            res.status(404).send("No se pudo eliminar el usuario.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

module.exports = router;