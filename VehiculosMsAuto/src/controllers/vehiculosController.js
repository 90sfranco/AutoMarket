const { Router } = require('express');
const router = Router();
const vehiculosModel = require('../models/vehiculosModel');


// Obtener todos los vehículos
router.get('/vehiculos/all', async (req, res) => {
    try {
        const vehicles = await vehiculosModel.getAllVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).send("Error de servidor.");
    }
});

// Consultar un vehículo por ID
router.get('/vehiculos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const vehicle = await vehiculosModel.getVehicleById(id);
        if (vehicle.length > 0) {
            res.json(vehicle[0]);
        } else {
            res.status(404).send("No se encontró el vehículo.");
        }
    } catch (error) {
        res.status(500).send("Error de servidor.");
    }
});

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

// Borrar un vehículo
router.delete('/vehiculos/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        var vehiculoExistente = await vehiculosModel.getVehicleById(id);

        if (!vehiculoExistente || !vehiculoExistente.length) {
            return res.status(404).send('Vehículo no encontrado.');                                
        }else{
            const result = await vehiculosModel.deleteVehicle(id);
            if (result.affectedRows > 0) {
                res.send("Vehículo eliminado con éxito.");
            } 
        }
        
    } catch (error) {
        res.status(500).send("Error de servidor.");
    }
});

module.exports = router;
