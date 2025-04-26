const { Router } = require('express');
const router = Router();
const vehiculosModel = require('../models/queriesModel');


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

// Consultar un vehículo por ID de vendedor
router.get('/vehiculos/when-user/:id', async (req, res) => {
    try {
        const id = req.params.id;  
        const vehicles = await vehiculosModel.getVehiclesByUser(id);
        res.json(vehicles);
    } catch (error) {
        res.status(500).send("Error de servidor.");
    }
});

// Obtener vehículos filtrados
router.post('/vehiculos/get-filtered', async (req, res) => {
    try {
        const filters = req.body; // Se espera que tenga: marca, precio_inicial, precio_final (todos opcionales)
        const vehicles = await vehiculosModel.getFilteredVehicles(filters);
        res.json(vehicles);
    } catch (error) {
        res.status(500).send("Error de servidor: " + error.message);
    }
});

module.exports = router;
