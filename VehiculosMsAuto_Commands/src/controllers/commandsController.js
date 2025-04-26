const { Router } = require('express');
const router = Router();
const vehiculosModel = require('../models/commandsModel');


// Crear un nuevo vehículo
router.post('/vehiculos/create', async (req, res) => {
    try {
        const {
            marca,
            anio,
            modelo,
            kilometraje,
            tipoCarroceria,
            numCilindros,
            transmision,
            trenTraction,
            colorInterior,
            colorExterior,
            numPasajeros,
            numPuertas,
            tipoCombustible,
            precio,
            estado,
            idUsuario
        } = req.body;

        await vehiculosModel.createVehicle(
            marca,
            anio,
            modelo,
            kilometraje,
            tipoCarroceria,
            numCilindros,
            transmision,
            trenTraction,
            colorInterior,
            colorExterior,
            numPasajeros,
            numPuertas,
            tipoCombustible,
            precio,
            estado,
            idUsuario
        );
        res.send("Vehículo creado con éxito.");
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Actualizar un vehículo existente
router.put('/vehiculos/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {
            marca,
            anio,
            modelo,
            kilometraje,
            tipoCarroceria,
            numCilindros,
            transmision,
            trenTraction,
            colorInterior,
            colorExterior,
            numPasajeros,
            numPuertas,
            tipoCombustible,
            precio,
            estado,
            idUsuario
        } = req.body;

        var vehiculoExistente = await vehiculosModel.getVehicleById(id);

        if (!vehiculoExistente || !vehiculoExistente.length) {
            return res.status(404).send('Vehículo no encontrado.');
        }else{
            const result = await vehiculosModel.updateVehicle(
                id,
                marca,
                anio,
                modelo,
                kilometraje,
                tipoCarroceria,
                numCilindros,
                transmision,
                trenTraction,
                colorInterior,
                colorExterior,
                numPasajeros,
                numPuertas,
                tipoCombustible,
                precio,
                estado,
                idUsuario
            );

            if (result.affectedRows > 0) {
                res.send("Vehículo actualizado con éxito.");
            }
        }

    } catch (error) {
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
