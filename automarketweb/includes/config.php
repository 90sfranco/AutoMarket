<?php
// Configuración de las URLs base para los microservicios
define('USERS_SERVICE_URL', 'http://usuarios-ms:4001/usuarios');
define('VEHICLES_QUERIES_SERVICE_URL', 'http://vehiculos-queries-ms:4005/vehiculos');
define('VEHICLES_COMMANDS_SERVICE_URL', 'http://vehiculos-commands-ms:4006/vehiculos');
define('CONTRACTS_SERVICE_URL', 'http://contratos-ms:4003/contratos');
define('SALES_SERVICE_URL', 'http://ventas-ms:4004/ventas');

// Iniciar la sesión
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>
