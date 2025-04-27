const { Router } = require('express');
const axios = require('axios');
const router = Router();
const ventasModel = require('../models/ventasModel');

// URL base de los microservicios
const BASE_URL_VEHICULOS_QUERIES  = 'http://localhost:4006/vehiculos'; // Para consultas
const BASE_URL_VEHICULOS_COMMANDS = 'http://localhost:4005/vehiculos'; // Para comandos (actualizar estado)
const BASE_URL_CONTRATOS = 'http://localhost:4003/contratos';

/**
 * GET /ventas
 * Retorna todas las ventas almacenadas.
 */
router.get('/ventas/all', async (req, res) => {
    try {
        const ventas = await ventasModel.getVentas();
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).send('Error al obtener ventas.');
    }
});

/**
 * GET /ventas/:id
 * Retorna la venta correspondiente al ID especificado.
 */
router.get('/ventas/:id', async (req, res) => {
    const idVenta = req.params.id;
    try {
        const venta = await ventasModel.getVentaById(idVenta);
        if (venta.length === 0) {
            return res.status(404).send('Venta no encontrada.');
        }
        res.json(venta[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).send('Error al obtener la venta.');
    }
});

/**
 * GET /ventas/user/:id
 * Retorna las ventas asociadas a un usuario.
 * Para ello, se consultan los contratos donde el usuario es comprador o vendedor mediante
 * los servicios de contratos, se extraen los IDs de contrato y se filtran las ventas.
 */
router.get('/ventas/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        // Consultar contratos donde el usuario es comprador
        const contratosCompradorResp = await axios.get(`${BASE_URL_CONTRATOS}/user/${userId}`);
        // Consultar contratos donde el usuario es vendedor
        const contratosVendedorResp = await axios.get(`${BASE_URL_CONTRATOS}/seller/${userId}`);
        
        const contratosComprador = contratosCompradorResp.data;
        const contratosVendedor = contratosVendedorResp.data;
        
        // Unificar IDs de contrato (suponiendo que cada contrato tiene un campo id_contrato)
        const contractIds = [];
        contratosComprador.forEach(c => contractIds.push(c.id_contrato));
        contratosVendedor.forEach(c => contractIds.push(c.id_contrato));
        
        if (contractIds.length === 0) {
            return res.json([]);
        }
        
        const ventas = await ventasModel.getVentasByUser(contractIds);
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas por usuario:', error);
        res.status(500).send('Error al obtener ventas para el usuario.');
    }
});

/**
 * POST /ventas
 * Crea una nueva venta.
 * Reglas de negocio:
 *  - Se recibe en el body: { id_contrato }.
 *  - Se calcula total_venta a partir de los atributos del contrato: 
 *      total_venta = contrato.vehiculo_precio + contrato.comision_fija.
 *  - Solo se crea la venta si el contrato asociado tiene estado_contrato "completado".
 *  - Luego de crear la venta, se debe actualizar el estado del vehículo a "vendido".
 */
/**
 * POST /ventas/create
 * Crea una nueva venta.
 * Reglas de negocio:
 *  - Se recibe en el body: { id_contrato }.
 *  - Se calcula total_venta a partir de los atributos del contrato: 
 *      total_venta = contrato.vehiculo_precio + contrato.comision_fija.
 *  - No se permite crear una venta si ya existe una con ese id_contrato.
 *  - Solo se crea la venta si el contrato asociado tiene estado_contrato "completado".
 *  - Luego de crear la venta, se debe actualizar el estado del vehículo a "vendido".
 */
router.post('/ventas/create', async (req, res) => {
    const { id_contrato } = req.body;
    
    // Validación básica: id_contrato es requerido
    if (!id_contrato) {
        return res.status(400).send('Se requiere id_contrato.');
    }
    
    try {
        // Verificar si ya existe una venta con ese contrato
        const ventaExistente = await ventasModel.getVentaByContrato(id_contrato);
        if (ventaExistente && ventaExistente.length > 0) {
            return res.status(400).send('Ya existe una venta para ese contrato.');
        }
        
        // Consultar el contrato para validar su estado y obtener los datos necesarios
        const contratoResp = await axios.get(`${BASE_URL_CONTRATOS}/${id_contrato}`);
        const contrato = contratoResp.data;
        
        if (!contrato) {
            return res.status(404).send('Contrato no encontrado.');
        }
        
        // Validar que el contrato esté completado
        if (contrato.estado_contrato.toLowerCase() !== 'completado') {
            return res.status(400).send('El contrato no se encuentra completado, por lo que no se puede crear la venta.');
        }
        
        // Calcular el total de la venta a partir de los atributos del contrato:
        // total_venta = precio del vehículo + comisión fija
        const total_venta = parseFloat(contrato.vehiculo_precio) + parseFloat(contrato.comision_fija);
        
        // Crear la venta en la base de datos de Ventas
        const idVenta = await ventasModel.postVenta(id_contrato, total_venta);
        
        // Actualizar el estado del vehículo a "vendido" mediante el servicio correspondiente
        const idVehiculo = contrato.id_vehiculo;
        await axios.patch(`${BASE_URL_VEHICULOS_COMMANDS}/edit-status/${idVehiculo}`, {
            estado: "vendido"
        });
        
        // Respuesta exitosa
        res.status(201).json({ id_venta: idVenta, message: 'success.' });
        
    } catch (error) {
        console.error('Error al crear la venta:', error.message);
        res.status(500).send('Error al crear la venta.');
    }
});


module.exports = router;
