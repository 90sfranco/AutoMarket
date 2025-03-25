<?php
include '../includes/config.php';

if (!isset($_SESSION['id_usuario'])) {
    die("Usuario no autenticado.");
}

$userId = isset($_GET['id']) ? $_GET['id'] : null;
if (!$userId) {
    die("No se especificó el ID de usuario.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $identificacion = trim($_POST['identificacion']);
    $telefono = trim($_POST['telefono']);
    $direccion = trim($_POST['direccion']);
    $usuario = trim($_POST['usuario']);
    $password = trim($_POST['password']);

    // Validar que todos los campos están llenos
    if (empty($nombre) || empty($email) || empty($identificacion) || empty($telefono) || empty($direccion) || empty($usuario) || empty($password)) {
        header("Location: /automarketweb/views/user_edit.php?error=" . urlencode("Todos los campos son obligatorios."));
        exit();
    }

    $data = array(
        "nombre" => $nombre,
        "email" => $email,
        "identificacion" => $identificacion,
        "telefono" => $telefono,
        "direccion" => $direccion,
        "usuario" => $usuario,
        "password" => $password
    );

    $json_data = json_encode($data);
    $endpoint = USERS_SERVICE_URL . '/edit/' . $userId;

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if(curl_errno($ch)){
        $error_msg = curl_error($ch);
    }
    curl_close($ch);

    if (isset($error_msg)) {
        header("Location: /automarketweb/views/user_edit.php?error=" . urlencode("Error al actualizar: " . $error_msg));
        exit();
    } elseif ($httpCode !== 200) {
        header("Location: /automarketweb/views/user_edit.php?error=" . urlencode("Error al actualizar: " . $response));
        exit();
    } else {
        header("Location: /automarketweb/views/vehicles.php?success=" . urlencode("Perfil actualizado con éxito."));
        exit();
    }
} else {
    header("Location: /automarketweb/views/user_edit.php");
    exit();
}
?>
