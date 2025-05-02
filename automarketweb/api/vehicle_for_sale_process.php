<?php
// api/vehicle_for_sale_process.php

include '../includes/config.php';

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger y sanitizar los datos del formulario
    $data = [
        'marca'             => trim($_POST['marca']),
        'anio'              => (int)$_POST['anio'],
        'modelo'            => trim($_POST['modelo']),
        'kilometraje'       => (int)$_POST['kilometraje'],
        // Convertir nombres de campos al formato que espera la API
        'tipoCarroceria'    => trim($_POST['tipo_carroceria']),
        'numCilindros'      => (int)$_POST['num_cilindros'],
        'transmision'       => trim($_POST['transmision']),
        'trenTraction'      => trim($_POST['tren_traction']),
        'colorInterior'     => trim($_POST['color_interior']),
        'colorExterior'     => trim($_POST['color_exterior']),
        'numPasajeros'      => (int)$_POST['num_pasajeros'],
        'numPuertas'        => (int)$_POST['num_puertas'],
        'tipoCombustible'   => trim($_POST['tipo_combustible']),
        'precio'            => (float)$_POST['precio'],
        'estado'            => trim($_POST['estado']),
        'idUsuario'         => (int)($_POST['id_usuario'] ?? 0)
    ];

    // Validar que el idUsuario sea válido
    if (empty($data['idUsuario']) || $data['idUsuario'] <= 0) {
        header("Location: ../views/vehicle_sale.php?msg=invalid_user");
        exit;
    }

    // Configurar cURL para enviar los datos en formato JSON
    $url = VEHICLES_COMMANDS_SERVICE_URL . '/create';
    $ch = curl_init($url);
    $jsonData = json_encode($data);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $jsonData,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ]
    ]);

    // Ejecutar la solicitud cURL
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Redirigir de vuelta a la vista con un mensaje
    if ($httpCode == 200) {
        header("Location: ../views/vehicle_sale.php?msg=success-vehicle-created");
    } else {
        header("Location: ../views/vehicle_sale.php?msg=error-vehicle-no-created");
    }
    exit;
}

// Si se accede sin POST, redirige a la vista
header("Location: ../views/vehicle_sale.php");
exit;
