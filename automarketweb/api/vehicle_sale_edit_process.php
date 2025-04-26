<?php
// C:\xampp\htdocs\automarketweb\api\vehicle_sale_edit_process.php

include '../includes/config.php';

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../views/vehicle_sale_edit.php?msg=invalid_method");
    exit;
}

// Recoger los datos del formulario
$idVehiculo     = isset($_POST['id_vehiculo']) ? (int)$_POST['id_vehiculo'] : 0;
$marca          = trim($_POST['marca'] ?? '');
$anio           = (int)($_POST['anio'] ?? 0);
$modelo         = trim($_POST['modelo'] ?? '');
$kilometraje    = (int)($_POST['kilometraje'] ?? 0);
$tipoCarroceria = trim($_POST['tipo_carroceria'] ?? '');
$numCilindros   = (int)($_POST['num_cilindros'] ?? 0);
$transmision    = trim($_POST['transmision'] ?? '');
$trenTraction   = trim($_POST['tren_traction'] ?? '');
$colorInterior  = trim($_POST['color_interior'] ?? '');
$colorExterior  = trim($_POST['color_exterior'] ?? '');
$numPasajeros   = (int)($_POST['num_pasajeros'] ?? 0);
$numPuertas     = (int)($_POST['num_puertas'] ?? 0);
$tipoCombustible= trim($_POST['tipo_combustible'] ?? '');
$estado         = trim($_POST['estado']??'');
$precio         = (float)($_POST['precio'] ?? 0);
$idUsuario      = (int)($_POST['id_usuario'] ?? 0);

// Validación mínima
if ($idVehiculo <= 0 || $idUsuario <= 0 || empty($marca)) {
    header("Location: ../views/vehicle_sale_edit.php?msg=error-vehicle-no-updated");
    exit;
}

// Construir el arreglo de datos (sin campo "estado")
$data = [
    'marca'            => $marca,
    'anio'             => $anio,
    'modelo'           => $modelo,
    'kilometraje'      => $kilometraje,
    'tipoCarroceria'   => $tipoCarroceria,
    'numCilindros'     => $numCilindros,
    'transmision'      => $transmision,
    'trenTraction'     => $trenTraction,
    'colorInterior'    => $colorInterior,
    'colorExterior'    => $colorExterior,
    'numPasajeros'     => $numPasajeros,
    'numPuertas'       => $numPuertas,
    'tipoCombustible'  => $tipoCombustible,
    'estado'           => $estado,
    'precio'           => $precio,
    'idUsuario'        => $idUsuario
];

// Preparar la solicitud cURL para enviar la actualización (método PUT o PATCH)
$url = VEHICLES_COMMANDS_SERVICE_URL . '/edit/' . $idVehiculo;
$ch = curl_init($url);
$jsonData = json_encode($data);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'PUT', // O 'PATCH' según la implementación de la API
    CURLOPT_POSTFIELDS     => $jsonData,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonData)
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Redirigir al listado de vehículos con mensaje según la respuesta
if ($httpCode === 200) {
    header("Location: ../views/vehicle_sale_edit.php?id=$idVehiculo&msg=success-vehicle-updated");
} else {
    header("Location: ../views/vehicle_sale_edit.php?id=$idVehiculo&msg=error-vehicle-no-updated");
}
exit;
