<?php
// Configuración de las URLs base para los microservicios
define('USERS_SERVICE_URL', 'http://192.168.100.2:4001/usuarios');
define('VEHICLES_SERVICE_URL', 'http://192.168.100.2:4002/vehiculos');
define('CONTRACTS_SERVICE_URL', 'http://192.168.100.2:4003/contratos');
define('SALES_SERVICE_URL', 'http://192.168.100.2:4004/ventas');

// Iniciar la sesión
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>
