const mysql = require('mysql2/promise');


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',  //puerto establecido para sql
    database: 'VehiculosDBAuto'
});


/**
 * Obtiene todos los vehículos
 */
async function getAllVehicles() {
    const result = await connection.query('SELECT * FROM vehiculo');
    console.log(`Total de vehiculos: ${result[0].length}`);
    return result[0];
}
/**
 * Obtiene todos los vehículos por usuario vendedor
 */
async function getVehiclesByUser(id) {
    const result = await connection.query('SELECT * FROM vehiculo WHERE id_usuario = ?', [id]);
    console.log(`Total de vehiculos: ${result[0].length}`);
    return result[0];
}

/**
 * Obtiene vehículos filtrados según la marca y/o rango de precio.
 * Si no se envía alguno de los filtros, se omite esa condición.
 */
async function getFilteredVehicles(filters) {
    let sql = "SELECT * FROM vehiculo WHERE 1=1 AND estado='disponible'";
    const params = [];

    if (filters.marca) {
        sql += " AND marca = ?";
        params.push(filters.marca);
    }
    
    if (filters.precio_inicial && filters.precio_final) {
        sql += " AND precio BETWEEN ? AND ?";
        params.push(filters.precio_inicial, filters.precio_final);
    } else if (filters.precio_inicial) {
        sql += " AND precio >= ?";
        params.push(filters.precio_inicial);
    } else if (filters.precio_final) {
        sql += " AND precio <= ?";
        params.push(filters.precio_final);
    }
    
    console.log("Consulta filtrada:", sql, params);
    const result = await connection.query(sql, params);
    return result[0];
}


/**
 * Obtiene un vehículo por su ID
 */
async function getVehicleById(id) {
    const result = await connection.query('SELECT * FROM vehiculo WHERE id_vehiculo = ?', [id]);
    return result[0];
}


// Exporta las funciones para su uso en otros módulos
module.exports = {
    getAllVehicles,
    getVehicleById,
    getVehiclesByUser,
    getFilteredVehicles
};