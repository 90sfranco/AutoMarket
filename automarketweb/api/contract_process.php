<?php
include '../includes/config.php'; 

// Verificar que se haya recibido el id del vehículo en GET
$idVehiculo = isset($_GET['id']) ? $_GET['id'] : null;
if (!$idVehiculo) {
    die("No se especificó un vehículo.");
}

// Verificar que el usuario está autenticado
if (!isset($_SESSION['id_usuario'])) {
    die("Usuario no autenticado.");
}
$idComprador = $_SESSION['id_usuario'];

// Verificar que se haya enviado condiciones de pago
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['condiciones_pago'])) {
    $condiciones_pago = trim($_POST['condiciones_pago']);
    if (empty($condiciones_pago)) {
        $error = "Debe ingresar las condiciones de pago.";
    } else {
        // Construir la URL del microservicio de contratos
        $endpoint = "http://localhost:4003/contratos/create/{$idComprador}/{$idVehiculo}";
        
        // Preparar los datos a enviar en JSON
        $data = array(
            'condiciones_pago' => $condiciones_pago
        );
        $json_data = json_encode($data);
        
        // Inicializar cURL para enviar la solicitud POST
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
        }
        curl_close($ch);
        
        // Verificar errores o si el microservicio devolvió un código distinto a 201 (Creado)
        if (isset($error_msg)) {
            $error = "Error en la creación del contrato: " . htmlspecialchars($error_msg);
        } elseif ($httpCode != 200) {
            // El microservicio devolvió un error (por ejemplo, duplicado)
            $error = "Error en la creación del contrato: " . htmlspecialchars($response);
        } else {
            $success = true;
        }
    }
} else {
    $error = "No se recibieron las condiciones de pago.";
}
?>

<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <?php if (isset($success) && $success): ?>
        <div class="alert alert-info text-center" role="alert">
            El contrato ha sido creado. Por favor, espere a que se complete el estado del contrato para seguir con la compra del vehículo.
        </div>
        <script>
            // Redirige después de 10 segundos
            setTimeout(function(){
                window.location.href = "/automarketweb/views/vehicles.php";
            }, 4000);
        </script>
    <?php else: ?>
        <div class="alert alert-danger text-center" role="alert">
            <?php echo isset($error) ? $error : "Ocurrió un error."; ?>
        </div>
        <div class="text-center">
            <a href="/automarketweb/views/vehicles.php", class="btn btn-secondary">Volver</a>
        </div>
    <?php endif; ?>
</div>
<?php include '../includes/footer.php'; ?>
