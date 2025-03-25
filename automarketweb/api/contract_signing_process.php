<?php
include '../includes/config.php';

$idContrato = isset($_GET['id']) ? $_GET['id'] : null;
if (!$idContrato) {
    die("No se especificó un contrato.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['estado_contrato'])) {
    $estado_contrato = trim($_POST['estado_contrato']);
    if (empty($estado_contrato)) {
        $error = "Las condiciones de pago no pueden estar vacías.";
    } else {
        // Construir la URL del microservicio para actualizar el contrato (PATCH)
        $endpoint = CONTRACTS_SERVICE_URL . '/edit/' . $idContrato;
        
        // Preparar los datos a enviar en JSON
        $data = array(
            'estado_contrato' => $estado_contrato
        );
        $json_data = json_encode($data);
        
        // Inicializar cURL y configurar la solicitud PATCH
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
        }
        curl_close($ch);
        
        if (isset($error_msg)) {
            $error = "Error al editar el contrato: " . htmlspecialchars($error_msg);
        } elseif ($httpCode !== 200) {
            $error = "Error al editar el contrato: " . htmlspecialchars($response);
        } else {
            $success = true;
        }
    }
} else {
    $error = "No se recibieron los datos necesarios.";
}
?>

<?php include '../includes/header.php'; ?>
<div class="container my-5">
    <?php if (isset($success) && $success): ?>
        <div class="alert alert-success text-center" role="alert">
            Se actualizó el estado del contrato.
        </div>
        <script>
            setTimeout(function() {
                window.location.href = "/automarketweb/views/contract_detail.php?id=<?php echo $idContrato; ?>";
            }, 3000);
        </script>
    <?php else: ?>
        <div class="alert alert-danger text-center" role="alert">
            <?php echo isset($error) ? $error : "Ocurrió un error."; ?>
        </div>
        <div class="text-center">
            <a href="/automarketweb/views/contract_detail.php?id=<?php echo $idContrato; ?>" class="btn btn-secondary">Volver</a>
        </div>
    <?php endif; ?>
</div>
<?php include '../includes/footer.php'; ?>
