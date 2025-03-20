const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    port: 3306,
    database: 'ContratosDBAuto'
});

// Obtener todos los contratos
async function getAllContracts() {
    const result = await connection.query('SELECT * FROM contrato');
    return result[0];
}

// Consultar un contrato por ID
async function getContractById(id) {
    const result = await connection.query('SELECT * FROM contrato WHERE id_contrato = ?', [id]);
    return result[0];
}

// Crear un nuevo contrato
async function createContract(
    comprador_nombre, comprador_email, comprador_identificacion, id_comprador,
    vendedor_nombre, vendedor_email, vendedor_identificacion, id_vendedor,
    id_vehiculo, vehiculo_marca, vehiculo_anio, vehiculo_modelo, vehiculo_kilometraje, vehiculo_tipo_carroceria,
    vehiculo_num_cilindros, vehiculo_transmision, vehiculo_tren_traction, vehiculo_color_interior, vehiculo_color_exterior,
    vehiculo_num_pasajeros, vehiculo_num_puertas, vehiculo_tipo_combustible, vehiculo_precio,
    condiciones_pago, comision_fija, estado_contrato
) {
    const query = `
        INSERT INTO contrato (
            comprador_nombre, comprador_email, comprador_identificacion, id_comprador,
            vendedor_nombre, vendedor_email, vendedor_identificacion, id_vendedor,
            id_vehiculo, vehiculo_marca, vehiculo_anio, vehiculo_modelo, vehiculo_kilometraje, vehiculo_tipo_carroceria,
            vehiculo_num_cilindros, vehiculo_transmision, vehiculo_tren_traction, vehiculo_color_interior, vehiculo_color_exterior,
            vehiculo_num_pasajeros, vehiculo_num_puertas, vehiculo_tipo_combustible, vehiculo_precio,
            condiciones_pago, comision_fija, estado_contrato
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
        comprador_nombre, comprador_email, comprador_identificacion, id_comprador,
        vendedor_nombre, vendedor_email, vendedor_identificacion, id_vendedor,
        id_vehiculo, vehiculo_marca, vehiculo_anio, vehiculo_modelo, vehiculo_kilometraje, vehiculo_tipo_carroceria,
        vehiculo_num_cilindros, vehiculo_transmision, vehiculo_tren_traction, vehiculo_color_interior, vehiculo_color_exterior,
        vehiculo_num_pasajeros, vehiculo_num_puertas, vehiculo_tipo_combustible, vehiculo_precio,
        condiciones_pago, comision_fija, estado_contrato
    ];
    const result = await connection.query(query, values);
    return result;
}

// Actualizar un contrato existente
async function updateContract(
    id_contrato,
    comprador_nombre, comprador_email, comprador_identificacion, id_comprador,
    vendedor_nombre, vendedor_email, vendedor_identificacion, id_vendedor,
    id_vehiculo, vehiculo_marca, vehiculo_anio, vehiculo_modelo, vehiculo_kilometraje, vehiculo_tipo_carroceria,
    vehiculo_num_cilindros, vehiculo_transmision, vehiculo_tren_traction, vehiculo_color_interior, vehiculo_color_exterior,
    vehiculo_num_pasajeros, vehiculo_num_puertas, vehiculo_tipo_combustible, vehiculo_precio,
    condiciones_pago, comision_fija, estado_contrato
) {
    const query = `
        UPDATE contrato SET
            comprador_nombre = ?, comprador_email = ?, comprador_identificacion = ?, id_comprador = ?,
            vendedor_nombre = ?, vendedor_email = ?, vendedor_identificacion = ?, id_vendedor = ?,
            id_vehiculo = ?, vehiculo_marca = ?, vehiculo_anio = ?, vehiculo_modelo = ?, vehiculo_kilometraje = ?, vehiculo_tipo_carroceria = ?,
            vehiculo_num_cilindros = ?, vehiculo_transmision = ?, vehiculo_tren_traction = ?, vehiculo_color_interior = ?, vehiculo_color_exterior = ?,
            vehiculo_num_pasajeros = ?, vehiculo_num_puertas = ?, vehiculo_tipo_combustible = ?, vehiculo_precio = ?,
            condiciones_pago = ?, comision_fija = ?, estado_contrato = ?
        WHERE id_contrato = ?
    `;
    const values = [
        comprador_nombre, comprador_email, comprador_identificacion, id_comprador,
        vendedor_nombre, vendedor_email, vendedor_identificacion, id_vendedor,
        id_vehiculo, vehiculo_marca, vehiculo_anio, vehiculo_modelo, vehiculo_kilometraje, vehiculo_tipo_carroceria,
        vehiculo_num_cilindros, vehiculo_transmision, vehiculo_tren_traction, vehiculo_color_interior, vehiculo_color_exterior,
        vehiculo_num_pasajeros, vehiculo_num_puertas, vehiculo_tipo_combustible, vehiculo_precio,
        condiciones_pago, comision_fija, estado_contrato,
        id_contrato
    ];
    const [result] = await connection.query(query, values);
    return result;
}

// Borrar un contrato
async function deleteContract(id) {
    const [result] = await connection.query('DELETE FROM contrato WHERE id_contrato = ?', [id]);
    return result;
}

module.exports = {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract
};
