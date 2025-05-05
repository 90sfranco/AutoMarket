<?php
include '../includes/config.php';

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['id_usuario'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit();
}

$idUsuario = $_SESSION['id_usuario'];

// Definir el endpoint unificado (/user)
$endpoint = CONTRACTS_SERVICE_URL . '/user/' . $idUsuario;

// Función para realizar la consulta con cURL y decodificar la respuesta JSON
function obtenerContratos($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $respuesta = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode == 200 && $respuesta) {
        return json_decode($respuesta, true);
    }
    return [];
}

// Obtener todos los contratos (tanto como comprador como vendedor)
$contratos = obtenerContratos($endpoint);

// Enviar respuesta JSON
header('Content-Type: application/json');
echo json_encode($contratos);
?>