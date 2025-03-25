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
// Consultar un contrato por id_vendedor (para consultar contratos creados por un comprador asociados a un vehículo nuestro)
async function getContractsBySeller(id) {
    const result = await connection.query('SELECT * FROM contrato WHERE id_vendedor = ?', [id]);
    return result[0];
}

// Consultar un contrato por ID
async function getContractsByUser(userId) {
    const result = await connection.query('SELECT * FROM contrato WHERE id_comprador = ?', [userId]);
    return result[0];
}

// Consultar un contrato por vehiculo
async function getContractsByVehicle(vehicleId) {
    const result = await connection.query('SELECT * FROM contrato WHERE id_vehiculo = ?', [vehicleId]);
    return result[0];
}


async function countContracts(id_comprador, id_vendedor, id_vehiculo) {
    const query = 'SELECT COUNT(*) AS contractCount FROM contrato WHERE id_comprador = ? AND id_vendedor = ? AND id_vehiculo = ?';
    const result = await connection.query(query, [id_comprador, id_vendedor, id_vehiculo]);
    return result[0][0].contractCount;
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

async function patchContractState(estado, id_contrato) {
    const query = `
        UPDATE contrato
        SET estado_contrato = ?
        WHERE id_contrato = ?;
    `;
    const [result] = await connection.execute(query, [estado, id_contrato]);
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
    getContractsByUser,
    patchContractState,
    getContractsByVehicle,
    getContractsBySeller,
    createContract,
    countContracts,
    deleteContract
};
