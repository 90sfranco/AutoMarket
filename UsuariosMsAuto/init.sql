-- Crear base de datos de usuarios
CREATE DATABASE IF NOT EXISTS UsuariosDBAuto;
USE UsuariosDBAuto;

-- Tabla principal
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SELECT 'Tabla usuarios creada exitosamente' AS Resultado;