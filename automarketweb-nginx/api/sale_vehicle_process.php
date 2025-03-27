<?php
include '../includes/config.php';

if (!isset($_SESSION['id_usuario'])) {
    die("Usuario no autenticado.");
}

$contractId = isset($_GET['id']) ? $_GET['id'] : null;
if (!$contractId) {
    die("No se especificó el id del contrato.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Se lee el valor enviado en el formulario con el nombre "estado_vehiculo"
    $estado = trim($_POST['estado_vehiculo']);

    $data = array(
        "id_contrato" => $contractId,
        "estado_vehiculo" => $estado,
    );

    $json_data = json_encode($data);
    $endpoint = SALES_SERVICE_URL . '/create';

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    // Si el código HTTP es 2xx se considera exitoso
    if ($httpCode < 200 || $httpCode >= 300) {
        $message = "Error al procesar pago: " . $response;
        $alertClass = "alert-danger";
    } else {
        $message = "El pago se realizó con éxito.";
        $alertClass = "alert-success";
    }
} else {
    header("Location: ../views/contracts_history.php");
    exit();
}
?>

<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <div class="alert <?php echo $alertClass; ?> text-center" role="alert">
        <?php echo htmlspecialchars($message); ?>
    </div>
    <script>
        setTimeout(function(){
            window.location.href = '../views/contracts_history.php';
        }, 2000);
    </script>
</div>
<?php include '../includes/footer.php'; ?>
