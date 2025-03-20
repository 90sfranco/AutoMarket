const { Router } = require('express');
const router = Router();
const axios = require('axios');
const contratosModel = require('../models/contratosModel');

// URL base de los microservicios de Usuarios y Vehículos (ajusta según tu entorno)
const USERS_SERVICE_URL = 'http://localhost:4001/usuarios';
const VEHICLES_SERVICE_URL = 'http://localhost:4002/vehiculos';

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

// Crear un nuevo contrato
router.post('/contratos/create/:idUsuario/:idVehiculo', async (req, res) => {

    const COMISION_FIJA = 100000;
    ESTADO_CONTRATO = 'En proceso';

    try {

        // Se obtiene el id del comprador desde la sesión activa
        const id_comprador = req.params.idUsuario;
        // Se asume que la ruta incluye el id del vehículo seleccionado
        const id_vehiculo = req.params.idVehiculo;
       
        if (!id_comprador) {
            return res.status(401).send("Usuario no autenticado.");
        }
        const { condiciones_pago} = req.body;
        
        // Obtener datos del vehículo desde el microservicio de vehículos
        const vehiculoResponse = await axios.get(`${VEHICLES_SERVICE_URL}/${id_vehiculo}`);
        if (!vehiculoResponse.data) {
            return res.status(404).send("Vehículo no encontrado.");
        }
        const vehiculo = vehiculoResponse.data;
        
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

// Actualizar un contrato existente
router.put('/contratos/edit/:idContrato', async (req, res) => {
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

        // Actualizar solo el estado del contrato, manteniendo los demás valores
        const result = await contratosModel.updateContract(
            id_contrato,
            contrato.comprador_nombre, contrato.comprador_email, contrato.comprador_identificacion, contrato.id_comprador,
            contrato.vendedor_nombre, contrato.vendedor_email, contrato.vendedor_identificacion, contrato.id_vendedor,
            contrato.id_vehiculo, contrato.vehiculo_marca, contrato.vehiculo_anio, contrato.vehiculo_modelo, contrato.vehiculo_kilometraje, contrato.vehiculo_tipo_carroceria,
            contrato.vehiculo_num_cilindros, contrato.vehiculo_transmision, contrato.vehiculo_tren_traction, contrato.vehiculo_color_interior, contrato.vehiculo_color_exterior,
            contrato.vehiculo_num_pasajeros, contrato.vehiculo_num_puertas, contrato.vehiculo_tipo_combustible, contrato.vehiculo_precio,
            contrato.condiciones_pago, contrato.comision_fija, estado_contrato
        );

        if (result.affectedRows > 0) {
            res.send("Contrato actualizado con éxito.");
        } else {
            res.status(404).send("No se pudo actualizar el contrato.");
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