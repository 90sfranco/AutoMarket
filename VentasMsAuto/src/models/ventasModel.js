const mysql = require('mysql2/promise');

// Pool de conexión a la base de datos VentasDBAuto
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'VentasDBAuto'
});


async function getVentas() {
    const [rows] = await pool.query("SELECT * FROM ventas");
    return rows;
}


async function getVentaById(idVenta) {
    const [rows] = await pool.query("SELECT * FROM ventas WHERE id_venta = ?", [idVenta]);
    return rows;
}


async function getVentaByContrato(id) {
    // Se arma la cláusula IN dinámicamente (el controlador se encarga de la validación de los IDs)
    const query = 'SELECT * FROM ventas WHERE id_contrato = ?' ;
    const [rows] = await pool.query(query, [id]);
    return rows;
}
async function getVentasByUser(contractIds) {
    if (!Array.isArray(contractIds) || contractIds.length === 0) {
        return [];
    }
    // Se arma la cláusula IN dinámicamente (el controlador se encarga de la validación de los IDs)
    const query = `SELECT * FROM ventas WHERE id_contrato IN (${contractIds.join(',')})`;
    const [rows] = await pool.query(query);
    return rows;
}



async function postVenta(id_contrato, total_venta) {
    try {
        const query = "INSERT INTO ventas (id_contrato, total_venta) VALUES (?, ?)";
        const [result] = await pool.execute(query, [id_contrato, total_venta]);
        return result.insertId;
    } catch (error) {
        console.error("Error al insertar la venta:", error);
        throw new Error("No se pudo insertar la venta");
    }
}

module.exports = {
    getVentas,
    getVentaById,
    getVentasByUser,
    getVentaByContrato,
    postVenta
};
