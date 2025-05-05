<?php
// Configuración de las URLs base para los microservicios
define('USERS_SERVICE_URL',             'http://kong:8000/usuarios');
define('VEHICLES_QUERIES_SERVICE_URL',  'http://kong:8000/vehiculos');
define('VEHICLES_COMMANDS_SERVICE_URL', 'http://kong:8000/vehiculos');
define('CONTRACTS_SERVICE_URL',         'http://kong:8000/contratos');
define('SALES_SERVICE_URL',             'http://kong:8000/ventas');

// Iniciar la sesión
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>
