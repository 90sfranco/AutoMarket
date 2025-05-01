-- Crear base de datos de ventas
CREATE DATABASE IF NOT EXISTS VentasDBAuto;
USE VentasDBAuto;

-- Tabla principal
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY, 
    id_contrato INT NOT NULL, 
    total_venta DECIMAL(10, 2) NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SELECT 'Tala ventas creada exitosamente' AS Resultado;