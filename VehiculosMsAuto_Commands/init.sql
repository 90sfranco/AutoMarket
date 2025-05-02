-- Crear base de datos específica (nombre debe coincidir exactamente con environment del compose)
CREATE DATABASE IF NOT EXISTS vehiculosdbauto_write;

USE vehiculosdbauto_write;

-- Crear tabla vehiculo
CREATE TABLE IF NOT EXISTS vehiculo (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    kilometraje INT NOT NULL,
    tipo_carroceria VARCHAR(50) NOT NULL,
    num_cilindros INT NOT NULL,
    transmision VARCHAR(50) NOT NULL,
    tren_traction VARCHAR(20) NOT NULL,
    color_interior VARCHAR(50) NOT NULL,
    color_exterior VARCHAR(50) NOT NULL,
    num_pasajeros INT NOT NULL,
    num_puertas INT NOT NULL,
    tipo_combustible VARCHAR(30) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(10) NOT NULL,
    id_usuario INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SELECT 'Tabla vehiculo creada exitosamente' AS Resultado;