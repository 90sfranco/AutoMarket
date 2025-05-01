const { Router } = require('express');
const vehiculosModel = require('../models/queriesModel');

const router = Router();

/**
 * Transforma un documento de vehículo a un objeto plano
 */
function transformVehicle(vehicle) {
  const plain = JSON.parse(JSON.stringify(vehicle));
  const precio = plain.precio?.$numberDecimal
    ? Number(plain.precio.$numberDecimal)
    : plain.precio;

  return {
    id_vehiculo: plain._id?.id_vehiculo || plain.id_vehiculo,
    marca: plain.marca,
    anio: plain.anio,
    modelo: plain.modelo,
    kilometraje: plain.kilometraje,
    tipo_carroceria: plain.tipo_carroceria,
    num_cilindros: plain.num_cilindros,
    transmision: plain.transmision,
    tren_traction: plain.tren_traction,
    color_interior: plain.color_interior,
    color_exterior: plain.color_exterior,
    num_pasajeros: plain.num_pasajeros,
    num_puertas: plain.num_puertas,
    tipo_combustible: plain.tipo_combustible,
    precio,
    estado: plain.estado,
    id_usuario: plain.id_usuario
  };
}

// Obtener todos los vehículos
router.get('/vehiculos/all', async (req, res) => {
  try {
    const vehicles = await vehiculosModel.getAllVehicles();
    const transformed = vehicles.map(transformVehicle);
    res.json(transformed);
  } catch (error) {
    res.status(500).send('Error de servidor.');
  }
});

// Consultar un vehículo por ID
router.get('/vehiculos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await vehiculosModel.getVehicleById(id);

    if (result.length === 0) {
      return res.status(404).send('No se encontró el vehículo.');
    }

    const transformed = transformVehicle(result[0]);
    res.json(transformed);
  } catch (error) {
    res.status(500).send('Error de servidor.');
  }
});

// Consultar vehículos por ID de vendedor
router.get('/vehiculos/when-user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const vehicles = await vehiculosModel.getVehiclesByUser(id);
    const transformed = vehicles.map(transformVehicle);
    res.json(transformed);
  } catch (error) {
    res.status(500).send('Error de servidor.');
  }
});

// Obtener vehículos filtrados
router.post('/vehiculos/get-filtered', async (req, res) => {
  try {
    const filters = req.body; // { marca?, precio_inicial?, precio_final? }
    const vehicles = await vehiculosModel.getFilteredVehicles(filters);
    const transformed = vehicles.map(transformVehicle);
    res.json(transformed);
  } catch (error) {
    res.status(500).send('Error de servidor: ' + error.message);
  }
});

module.exports = router;
