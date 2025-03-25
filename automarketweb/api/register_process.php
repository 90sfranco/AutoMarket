<?php
include '../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger y limpiar los datos del formulario
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $identificacion = trim($_POST['identificacion']);
    $telefono = trim($_POST['telefono']);
    $direccion = trim($_POST['direccion']);
    $usuario = trim($_POST['usuario']);
    $password = trim($_POST['password']);

    // Validar campos obligatorios
    if (empty($nombre) || empty($email) || empty($identificacion) || empty($usuario) || empty($password)) {
        $error = "Complete todos los campos obligatorios.";
    } else {
        // Preparar los datos para enviar (en formato JSON)
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

        // Construir la URL del microservicio de usuarios para crear un nuevo usuario
        $endpoint = USERS_SERVICE_URL . '/create';

        // Inicializar cURL para enviar la solicitud POST
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
        }
        curl_close($ch);

        if (isset($error_msg)) {
            $error = "Error en el registro: " . htmlspecialchars($error_msg);
        } elseif ($response === false || empty($response)) {
            $error = "Error en el registro: respuesta vacía.";
        } else {
            $success = "Registro exitoso. Ahora puedes iniciar sesión.";
        }
    }
} else {
    // Si se accedió sin método POST, redirigir de inmediato
    header("Location: /automarketweb/views/register.php");
    exit();
}
?>

<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <?php if (isset($error)): ?>
        <div class="alert alert-danger text-center" role="alert">
            <?php echo $error; ?>
        </div>
    <?php elseif(isset($success)): ?>
        <div class="alert alert-success text-center" role="alert">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>
    <script>
        // Redirige al login después de 2 segundos
        setTimeout(function(){
            window.location.href = "/automarketweb/views/login.php";
        }, 2000);
    </script>
</div>
<?php include '../includes/footer.php'; ?>
