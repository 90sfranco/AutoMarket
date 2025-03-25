<?php
include '../includes/config.php';  // Aquí definimos USERS_SERVICE_URL y arrancamos la sesión

// Recoger credenciales del formulario
$usuario = $_POST["usuario"];
$password = $_POST["password"];

if(empty($usuario) || empty($password)){
    header("Location: /automarketweb/views/login.php?error=campos_vacios");
    exit();
}

// URL del microservicio de usuarios para login
$url = USERS_SERVICE_URL . '/login';

// Preparar los datos a enviar en formato JSON
$data = array(
    'usuario' => $usuario,
    'password' => $password
);
$json_data = json_encode($data);

// Inicializar cURL
$ch = curl_init();

// Configurar opciones de cURL
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Ejecutar la solicitud POST
$response = curl_exec($ch);

// Manejar errores de cURL
if($response === false){
    curl_close($ch);
    header("Location: /automarketweb/views/login.php?error=conexion_fallida");
    exit();
}
curl_close($ch);

// Procesar la respuesta JSON del microservicio
$responseData = json_decode($response, true);

// Se espera que el microservicio devuelva un objeto con, por ejemplo, un 'id' y 'nombre'
if(isset($responseData["id"])){
    // Login exitoso: se guardan datos en sesión y se redirige normalmente
    $_SESSION['id_usuario'] = $responseData["id"];
    $_SESSION['nombre'] = $responseData["nombre"];
    header("Location: /automarketweb/views/vehicles.php");
    exit();
} else {
    // Login fallido: se muestra un mensaje de alerta y se redirige al login después de 4 segundos
    $message = "Credenciales incorrectas.";
    $alertClass = "alert-danger";
}
?>

<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <div class="alert <?php echo $alertClass; ?> text-center" role="alert">
        <?php echo htmlspecialchars($message); ?>
    </div>
    <script>
        setTimeout(function(){
            window.location.href = '/automarketweb/views/login.php';
        }, 1000);
    </script>
</div>
<?php include '../includes/footer.php'; ?>
