const { Router } = require('express');
const router = Router();
const axios = require('axios');
const contratosModel = require('../models/contratosModel');

// URL base de los microservicios de Usuarios y Vehículos (ajusta según tu entorno)
const USERS_SERVICE_URL = 'http://localhost:4001/usuarios';
const VEHICLES_SERVICE_URL = 'http://localhost:4006/vehiculos';

// Obtener todos los contratos
router.get('/contratos/all', async (req, res) => {
    try {
        const contracts = await contratosModel.getAllContracts();
        res.json(contracts);
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Consultar un contrato por ID
router.get('/contratos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contract = await contratosModel.getContractById(id);
        if (contract.length > 0) {
            res.json(contract[0]);
        } else {
            res.status(404).send("Contrato no encontrado.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

router.get('/contratos/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const contracts = await contratosModel.getContractsByUser(id);
        res.json(contracts);
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

router.get('/contratos/seller/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const contracts = await contratosModel.getContractsBySeller(id);
        res.json(contracts);
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Crear un nuevo contrato
router.post('/contratos/create/:idUsuario/:idVehiculo', async (req, res) => {

    const COMISION_FIJA = 100000;
    const ESTADO_CONTRATO = 'En proceso';

    try {
        // Se obtiene el id del comprador desde la URL
        const id_comprador = req.params.idUsuario;
        // Se asume que la ruta incluye el id del vehículo seleccionado
        const id_vehiculo = req.params.idVehiculo;
       
        if (!id_comprador) {
            return res.status(401).send("Usuario no autenticado.");
        }
        const { condiciones_pago } = req.body;

        // Obtener contratos por id_vehiculo
        const contracts = await contratosModel.getContractsByVehicle(id_vehiculo); 

        if (contracts.some(contract => contract.estado_contrato.toLowerCase() === "completado")) {
            return res.status(400).send("El vehículo ya está en proceso de venta.");          
        }

        // Obtener datos del vehículo desde el microservicio de vehículos
        const vehiculoResponse = await axios.get(`${VEHICLES_SERVICE_URL}/${id_vehiculo}`);
        if (!vehiculoResponse.data) {
            return res.status(404).send("Vehículo no encontrado.");
        }
        const vehiculo = vehiculoResponse.data;

        if (vehiculo.estado != 'disponible') {
            return res.status(404).send("El vehículo ya está vendido.");
        }

        // Obtener datos del comprador desde el microservicio de usuarios
        const compradorResponse = await axios.get(`${USERS_SERVICE_URL}/${id_comprador}`);
        if (!compradorResponse.data) {
            return res.status(404).send("Comprador no encontrado.");
        }
        const comprador = compradorResponse.data;
        
        // El id del vendedor se extrae de los datos del vehículo
        const id_vendedor = vehiculo.id_usuario;
        // Obtener datos del vendedor desde el microservicio de usuarios
        const vendedorResponse = await axios.get(`${USERS_SERVICE_URL}/${id_vendedor}`);
        if (!vendedorResponse.data) {
            return res.status(404).send("Vendedor no encontrado.");
        }
        const vendedor = vendedorResponse.data;
        
        // Verificar si ya existe un contrato para este comprador, vendedor y vehículo
        const count = await contratosModel.countContracts(comprador.id, vendedor.id, id_vehiculo);
        if (count > 0) {            
            return res.status(400).send("Ya existe un contrato vinculado con este vehículo.");
        }
        
        // Crear el contrato utilizando la información obtenida
        await contratosModel.createContract(
            comprador.nombre, comprador.email, comprador.identificacion, comprador.id,
            vendedor.nombre, vendedor.email, vendedor.identificacion, vendedor.id,
            id_vehiculo, vehiculo.marca, vehiculo.anio, vehiculo.modelo, vehiculo.kilometraje, vehiculo.tipo_carroceria,
            vehiculo.num_cilindros, vehiculo.transmision, vehiculo.tren_traction, vehiculo.color_interior, vehiculo.color_exterior,
            vehiculo.num_pasajeros, vehiculo.num_puertas, vehiculo.tipo_combustible, vehiculo.precio,
            condiciones_pago, COMISION_FIJA, ESTADO_CONTRATO
        );
        
        res.send("Contrato creado con éxito.");
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Actualizar el estado de un contrato a "completado" y poner los demás a "cancelado" usando PATCH.
router.patch('/contratos/edit/:idContrato', async (req, res) => {
    try {
        const id_contrato = req.params.idContrato;
        const { estado_contrato } = req.body;

        // Validar existencia del contrato en la base de datos
        const contratoExistente = await contratosModel.getContractById(id_contrato);
        if (!contratoExistente || contratoExistente.length === 0) {
            return res.status(404).send("Contrato no encontrado.");
        }

        // Obtener los datos actuales del contrato desde la propia base de datos
        const contrato = contratoExistente[0]; 

        if (contrato.estado_contrato === 'En proceso') {
            // Actualizar el estado del contrato mediante patch
            const result = await contratosModel.patchContractState(estado_contrato, id_contrato);
            if (result.affectedRows > 0) {
                res.send("Contrato actualizado con éxito.");

                // Obtener todos los contratos asociados al mismo vehículo
                const contracts = await contratosModel.getContractsByVehicle(contrato.id_vehiculo); 
                // Actualizar el estado de todos los contratos (por patch) que NO sean el contrato actual
                for (const contract of contracts) {
                    if (parseInt(contract.id_contrato) !== parseInt(id_contrato)) {
                        await contratosModel.patchContractState('cancelado', contract.id_contrato);
                    }
                }
            } else {
                res.status(404).send("No se pudo actualizar el contrato.");
            }
        } else {
            res.status(400).send("El contrato no está en proceso, por lo que no se puede actualizar.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

// Borrar un contrato
router.delete('/contratos/delete/:id', async (req, res) => {
    try {
        const id_contrato = req.params.id;
        
        // Validar existencia del contrato
        const contratoExistente = await contratosModel.getContractById(id_contrato);
        if (!contratoExistente || contratoExistente.length === 0) {
            return res.status(404).send("Contrato no encontrado.");
        }
        
        const result = await contratosModel.deleteContract(id_contrato);
        if (result.affectedRows > 0) {
            res.send("Contrato eliminado con éxito.");
        } else {
            res.status(404).send("No se pudo eliminar el contrato.");
        }
    } catch (error) {
        res.status(500).send(`Error de servidor: ${error.message}`);
    }
});

module.exports = router;
