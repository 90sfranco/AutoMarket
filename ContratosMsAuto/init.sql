-- Crear base de datos de contratos
CREATE DATABASE IF NOT EXISTS ContratosDBAuto;
USE ContratosDBAuto;

-- Tabla principal
CREATE TABLE IF NOT EXISTS contrato (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,

    -- Datos del comprador
    comprador_nombre VARCHAR(100) NOT NULL,
    comprador_email VARCHAR(100) NOT NULL,
    comprador_identificacion VARCHAR(20) NOT NULL,
    id_comprador INT NOT NULL,

    -- Datos del vendedor
    vendedor_nombre VARCHAR(100) NOT NULL,
    vendedor_email VARCHAR(100) NOT NULL,
    vendedor_identificacion VARCHAR(20) NOT NULL,
    id_vendedor INT NOT NULL,

    -- Datos del vehículo
    id_vehiculo INT NOT NULL,
    vehiculo_marca VARCHAR(50) NOT NULL,
    vehiculo_anio INT NOT NULL,
    vehiculo_modelo VARCHAR(50) NOT NULL,
    vehiculo_kilometraje INT NOT NULL,
    vehiculo_tipo_carroceria VARCHAR(50) NOT NULL,
    vehiculo_num_cilindros INT NOT NULL,
    vehiculo_transmision VARCHAR(50) NOT NULL,
    vehiculo_tren_traction VARCHAR(50) NOT NULL,
    vehiculo_color_interior VARCHAR(50) NOT NULL,
    vehiculo_color_exterior VARCHAR(50) NOT NULL,
    vehiculo_num_pasajeros INT NOT NULL,
    vehiculo_num_puertas INT NOT NULL,
    vehiculo_tipo_combustible VARCHAR(50) NOT NULL,
    vehiculo_precio DECIMAL(10,2) NOT NULL,
    vehiculo_estado VARCHAR(20) NOT NULL,
    
    -- Contrato
    condiciones_pago TEXT NOT NULL,
    comision_fija DECIMAL(10,2) NOT NULL,
    estado_contrato VARCHAR(20) NOT NULL,

    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SELECT 'Tabla contrato creada exitosamente' AS Resultado;