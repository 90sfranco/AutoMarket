const { Router } = require('express');
const router = Router();
const vehiculosModel = require('../models/commandsModel');
const axios = require('axios'); // Importar axios para llamadas HTTP

const USUARIOS_MS_URL = process.env.USUARIOS_MS_URL || 'http://usuarios-ms:4001'; // URL base del microservicio de usuarios

// Función para validar los datos del vehículo
const validateVehicleData = (data) => {
    const requiredFields = [
        'marca', 'anio', 'modelo', 'kilometraje', 'tipoCarroceria',
        'numCilindros', 'transmision', 'trenTraction', 'colorInterior',
        'colorExterior', 'numPasajeros', 'numPuertas', 'tipoCombustible',
        'precio', 'estado', 'idUsuario'
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            return `El campo '${field}' es obligatorio.`;
        }
    }

    const numericFields = [
        'anio', 'kilometraje', 'numCilindros', 'numPasajeros', 'numPuertas', 'precio'
    ];

    for (const field of numericFields) {
        if (isNaN(data[field]) || typeof data[field] !== 'number') {
            return `El campo '${field}' debe ser un número.`;
        }
        if (data[field] < 0) {
             return `El campo '${field}' debe ser un número positivo.`;
        }
    }

    if (data.anio <= 1900 || data.anio > new Date().getFullYear() + 1) {
        return 'El año del vehículo no es válido.';
    }

    const validStates = ['disponible', 'vendido'];
    if (!validStates.includes(data.estado)) {
        return "El campo 'estado' debe ser 'disponible' o 'vendido'.";
    }

    return null; // No hay errores de validación
};


// Crear un nuevo vehículo
router.post('/vehiculos/create', async (req, res) => {
    try {
        const vehicleData = req.body;

        // Validar datos del vehículo
        const validationError = validateVehicleData(vehicleData);
        if (validationError) {
            return res.status(400).send(validationError);
        }

        // Validar existencia del usuario
        const { idUsuario } = vehicleData;
        try {
            const userResponse = await axios.get(`${USUARIOS_MS_URL}/usuarios/${idUsuario}`);
            if (userResponse.status !== 200 || !userResponse.data) {
                return res.status(400).send(`El usuario con ID ${idUsuario} no existe.`);
            }
        } catch (userError) {
            // Si hay un error en la llamada al MS de usuarios (ej. conexión rechazada, 404, etc.)
            if (userError.response && userError.response.status === 404) {
                 return res.status(400).send(`El usuario con ID ${idUsuario} no existe.`);
            }
            console.error("Error al validar usuario:", userError.message);
            return res.status(500).send("Error al validar la existencia del usuario.");
        }


        await vehiculosModel.createVehicle(
            vehicleData.marca,
            vehicleData.anio,
            vehicleData.modelo,
            vehicleData.kilometraje,
            vehicleData.tipoCarroceria,
            vehicleData.numCilindros,
            vehicleData.transmision,
            vehicleData.trenTraction,
            vehicleData.colorInterior,
            vehicleData.colorExterior,
            vehicleData.numPasajeros,
            vehicleData.numPuertas,
            vehicleData.tipoCombustible,
            vehicleData.precio,
            vehicleData.estado,
            vehicleData.idUsuario
        );
        res.send("Vehículo creado con éxito.");
    } catch (error) {
        console.error("Error al crear vehículo:", error.message);
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Actualizar un vehículo existente
router.put('/vehiculos/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const vehicleData = req.body;

        // Validar datos del vehículo
        const validationError = validateVehicleData(vehicleData);
        if (validationError) {
            return res.status(400).send(validationError);
        }

        // Validar existencia del vehículo a editar
        var vehiculoExistente = await vehiculosModel.getVehicleById(id);
        if (!vehiculoExistente || !vehiculoExistente.length) {
            return res.status(404).send('Vehículo no encontrado.');
        }

        // Validar existencia del usuario
        const { idUsuario } = vehicleData;
         try {
            const userResponse = await axios.get(`${USUARIOS_MS_URL}/usuarios/${idUsuario}`);
            if (userResponse.status !== 200 || !userResponse.data) {
                return res.status(400).send(`El usuario con ID ${idUsuario} no existe.`);
            }
        } catch (userError) {
            // Si hay un error en la llamada al MS de usuarios (ej. conexión rechazada, 404, etc.)
            if (userError.response && userError.response.status === 404) {
                 return res.status(400).send(`El usuario con ID ${idUsuario} no existe.`);
            }
            console.error("Error al validar usuario:", userError.message);
            return res.status(500).send("Error al validar la existencia del usuario.");
        }


        const result = await vehiculosModel.updateVehicle(
            id,
            vehicleData.marca,
            vehicleData.anio,
            vehicleData.modelo,
            vehicleData.kilometraje,
            vehicleData.tipoCarroceria,
            vehicleData.numCilindros,
            vehicleData.transmision,
            vehicleData.trenTraction,
            vehicleData.colorInterior,
            vehicleData.colorExterior,
            vehicleData.numPasajeros,
            vehicleData.numPuertas,
            vehicleData.tipoCombustible,
            vehicleData.precio,
            vehicleData.estado,
            vehicleData.idUsuario
        );

        if (result.affectedRows > 0) {
            res.send("Vehículo actualizado con éxito.");
        } else {
             // Si affectedRows es 0, puede que la consulta se ejecutó pero no hubo cambios
             res.status(200).send("Vehículo actualizado con éxito (sin cambios detectados).");
        }


    } catch (error) {
        console.error("Error al actualizar vehículo:", error.message);
        res.status(500).send(`Error de servidor: ${error.message}.`);
    }
});

router.patch('/vehiculos/edit-status/:id', async (req, res) => {
    try {
        const id = req.params.id;  // Obtener el id del vehículo desde la URL
        const { estado } = req.body;  // Obtener el nuevo estado desde el cuerpo de la solicitud

        // Verificar si el estado fue proporcionado
        if (!estado) {
            return res.status(400).send('Estado es requerido');
        }

        // Verificar si el vehículo existe en la base de datos
        const vehiculoExistente = await vehiculosModel.getVehicleById(id);

        if (!vehiculoExistente || !vehiculoExistente.length) {
            return res.status(404).send('Vehículo no encontrado');
        }

        // Actualizar solo el campo de estado del vehículo
        const result = await vehiculosModel.updateVehicleState(id, estado);

        // Verificar que la actualización fue exitosa
        if (result.affectedRows > 0) {
            res.status(200).send(`Vehículo con ID ${id} actualizado a "${estado}`);
        } else {
            res.status(400).send('Error al actualizar el estado del vehículo');
        }

    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Borrar un vehículo
router.delete('/vehiculos/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Obtener el vehículo (se espera un arreglo con un elemento)
        const vehiculo = await vehiculosModel.getVehicleById(id);

        if (!vehiculo || !vehiculo.length) {
            return res.status(404).send('Vehículo no encontrado.');
        } else {
            // Acceder al primer elemento y verificar su estado
            if (vehiculo[0].estado === 'vendido') {
                return res.status(400).send('No puede eliminar un vehículo vendido.');
            }

            const result = await vehiculosModel.deleteVehicle(id);
            if (result.affectedRows > 0) {
                res.send("Vehículo eliminado con éxito.");
            } else {
                res.status(400).send("No se pudo eliminar el vehículo.");
            }
        }

    } catch (error) {
        res.status(500).send("Error de servidor.");
    }
});

module.exports = router;
