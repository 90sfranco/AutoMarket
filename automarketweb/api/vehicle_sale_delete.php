<?php
// api/vehicle_delete.php

include '../includes/config.php';

if (!isset($_GET['id'])) {
    header("Location: ../views/vehicle_sale.php?msg=" . urlencode("error:No se especificó el vehículo."));
    exit;
}

$vehicleId = (int)$_GET['id'];

// Configurar cURL para enviar la solicitud DELETE
$url = VEHICLES_COMMANDS_SERVICE_URL . '/delete/' . $vehicleId;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    header("Location: ../views/vehicle_sale.php?msg=" . urlencode("success-vehicle-deleted"));
} else {
    // Se envía el mensaje de error obtenido en $response, concatenado al prefijo "error-vehicle-no-deleted:"
    header("Location: ../views/vehicle_sale.php?msg=" . urlencode("error-vehicle-no-deleted: " . $response));
}
exit;
?>
