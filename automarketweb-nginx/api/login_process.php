<?php
// login_process.php

// Inicia la sesión y carga la configuración (por ejemplo, USERS_SERVICE_URL)
include '../includes/config.php';

// Solo procesamos si el método es POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Recoger credenciales del formulario
    $usuario = isset($_POST["usuario"]) ? $_POST["usuario"] : '';
    $password = isset($_POST["password"]) ? $_POST["password"] : '';

    if (empty($usuario) || empty($password)) {
        header("Location: ../views/login.php?error=campos_vacios");
        exit();
    }

    // URL del microservicio para login
    $url = USERS_SERVICE_URL . '/login';

    // Preparar los datos en JSON
    $data = array(
        'usuario' => $usuario,
        'password' => $password
    );
    $json_data = json_encode($data);

    // Inicializar cURL y configurar opciones
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Ejecutar la solicitud y obtener la respuesta
    $response = curl_exec($ch);
    if ($response === false) {
        curl_close($ch);
        header("Location: ../views/login.php?error=conexion_fallida");
        exit();
    }
    curl_close($ch);

    // Procesar la respuesta JSON
    $responseData = json_decode($response, true);

    // Si el microservicio devuelve un 'id', login exitoso
    if (isset($responseData["id"])) {
        $_SESSION['id_usuario'] = $responseData["id"];
        $_SESSION['nombre'] = $responseData["nombre"];
        header("Location: ../views/vehicles.php");
        exit();
    } else {
        // Login fallido
        $message = "Credenciales incorrectas.";
        $alertClass = "alert-danger";
    }
} else {
    // Si se accede sin método POST, redirige al login
    header("Location: ../views/login.php");
    exit();
}
?>
<!-- A partir de aquí, ya no se ejecuta si hubo redirección -->
<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <div class="alert <?php echo isset($alertClass) ? $alertClass : ''; ?> text-center" role="alert">
        <?php echo isset($message) ? htmlspecialchars($message) : ''; ?>
    </div>
    <script>
        setTimeout(function(){
            window.location.href = '../views/login.php';
        }, 1000);
    </script>
</div>
<?php include '../includes/footer.php'; ?>
