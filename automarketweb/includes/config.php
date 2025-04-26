<?php
// Configuración de las URLs base para los microservicios
define('USERS_SERVICE_URL', 'http://localhost:4001/usuarios');
define('VEHICLES_QUERIES_SERVICE_URL', 'http://localhost:4006/vehiculos');
define('VEHICLES_COMMANDS_SERVICE_URL', 'http://localhost:4005/vehiculos');
define('CONTRACTS_SERVICE_URL', 'http://localhost:4003/contratos');
define('SALES_SERVICE_URL', 'http://localhost:4004/ventas');

// Iniciar la sesión
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>
