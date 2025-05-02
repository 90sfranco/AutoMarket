<?php include '../includes/header.php'; ?>
<?php include '../includes/config.php'; ?>

<?php
// Obtener el id del contrato desde GET
$idContrato = isset($_GET['id']) ? $_GET['id'] : null;
if (!$idContrato) {
    echo "<p class='text-danger text-center'>No se especificó un contrato.</p>";
    include '../includes/footer.php';
    exit();
}

// Construir la URL del microservicio para obtener el detalle del contrato
$endpoint = CONTRACTS_SERVICE_URL . '/' . $idContrato;

// Inicializar cURL para obtener el detalle del contrato
$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el contrato con id $idContrato.</p>";
    include '../includes/footer.php';
    exit();
}

// Decodificar la respuesta JSON del contrato
$contrato = json_decode($response, true);
if (!$contrato) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del contrato.</p>";
    include '../includes/footer.php';
    exit();
}

// Obtener el id del vehículo desde el contrato
$idVehiculo = $contrato['id_vehiculo'];

// Construir la URL del servicio para obtener los detalles del vehículo
$vehiculoEndpoint = VEHICLES_QUERIES_SERVICE_URL . '/' . $idVehiculo;

// Hacer la llamada cURL para obtener los detalles del vehículo
$ch = curl_init($vehiculoEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$vehiculoResponse = curl_exec($ch);
$vehiculoHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($vehiculoHttpCode != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el vehículo con id $idVehiculo.</p>";
    include '../includes/footer.php';
    exit();
}

// Decodificar la respuesta JSON del vehículo
$vehiculo = json_decode($vehiculoResponse, true);
if (!$vehiculo) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del vehículo.</p>";
    include '../includes/footer.php';
    exit();
}
?>

<h2 class="fs-2 mb-4 text-center">Detalle del Contrato</h2>

<!-- Lógica de mensajes según estado y usuario -->
<?php if ($contrato['estado_contrato'] === 'completado'): ?>
    <?php if ($_SESSION['id_usuario'] == $contrato['id_vendedor']): ?>
        <div class="alert alert-info text-center mx-auto" style="max-width: fit-content;">
            💸 Esperando pago de <strong><?php echo htmlspecialchars($contrato['comprador_nombre']); ?></strong>
        </div>
    <?php elseif ($_SESSION['id_usuario'] == $contrato['id_comprador'] && $vehiculo['estado'] !== 'vendido'): ?>
        <div class="alert alert-info text-center mx-auto" style="max-width: fit-content;">
            💸 ¡Ya puedes realizar el pago de tu futuro <?php echo htmlspecialchars($contrato['vehiculo_marca']) . " " . htmlspecialchars($contrato['vehiculo_modelo']); ?>!
        </div>
    <?php endif; ?>
<?php elseif ($contrato['estado_contrato'] === 'En proceso'): ?>
    <?php if ($_SESSION['id_usuario'] == $contrato['id_comprador']): ?>
        <div class="alert alert-info text-center mx-auto" style="max-width: fit-content;">
            ⏳ En espera de que el vendedor apruebe el contrato
        </div>
    <?php elseif ($_SESSION['id_usuario'] == $contrato['id_vendedor']): ?>
        <div class="alert alert-info text-center mx-auto" style="max-width: fit-content;">
            ℹ️ Al firmar el contrato tu vehículo dejará de estar visible y entrará a proceso de pago con <strong><?php echo htmlspecialchars($contrato['comprador_nombre']); ?></strong>
        </div>
    <?php endif; ?>
<?php endif; ?>


<div class="card mb-4 mx-auto" style="max-width: 60rem; background-color: #f9f9f9; border: 1px solid #ccc;">
    <div class="card-body">
        <div class="row">
            <!-- Información del Comprador -->
            <div class="col-md-4 border-end">
                <h5 class="text-center">Comprador</h5>
                <p><strong>Nombre:</strong> <?php echo htmlspecialchars($contrato['comprador_nombre']); ?></p>
                <p><strong>Email:</strong> <?php echo htmlspecialchars($contrato['comprador_email']); ?></p>
                <p><strong>Identificación:</strong> <?php echo htmlspecialchars($contrato['comprador_identificacion']); ?></p>
            </div>
            <!-- Información del Vendedor -->
            <div class="col-md-4 border-end">
                <h5 class="text-center">Vendedor</h5>
                <p><strong>Nombre:</strong> <?php echo htmlspecialchars($contrato['vendedor_nombre']); ?></p>
                <p><strong>Email:</strong> <?php echo htmlspecialchars($contrato['vendedor_email']); ?></p>
                <p><strong>Identificación:</strong> <?php echo htmlspecialchars($contrato['vendedor_identificacion']); ?></p>
            </div>
            <!-- Información del Vehículo -->
            <div class="col-md-4">
                <h5 class="text-center">Vehículo</h5>
                <p><strong>Marca/Modelo:</strong> <?php echo htmlspecialchars($contrato['vehiculo_marca']) . " " . htmlspecialchars($contrato['vehiculo_modelo']); ?></p>
                <p><strong>Año:</strong> <?php echo htmlspecialchars($contrato['vehiculo_anio']); ?></p>
                <p><strong>Kilometraje:</strong> <?php echo htmlspecialchars($contrato['vehiculo_kilometraje']); ?></p>
                <p><strong>Precio:</strong> <span class="badge bg-success rounded-pill">$<?php echo number_format($contrato['vehiculo_precio'], 2); ?></span></p>
                
                <!-- Mostrar el estado del vehículo -->
                <?php if ($vehiculo['estado'] === 'disponible'): ?>
                    <p><strong>Estado:</strong> <span class="badge bg-success rounded-pill">Disponible</span></p>
                <?php elseif ($vehiculo['estado'] === 'vendido'): ?>
                    <p><strong>Estado:</strong> <span class="badge bg-danger rounded-pill">Vendido</span></p>
                <?php endif; ?>

                <p><strong>Fecha Creación:</strong> <?php echo date("d/m/Y", strtotime($contrato['fecha_creacion'])); ?></p>
            </div>
        </div>
        <hr>
        <!-- Condiciones de Pago en campo de solo lectura -->
        <div class="row">
            <div class="col text-center">
                <h5>Condiciones de Pago</h5>
                <textarea id="condiciones_pago" name="condiciones_pago" class="form-control" rows="4" readonly><?php echo htmlspecialchars($contrato['condiciones_pago']); ?></textarea>
            </div>
        </div>
    </div>
</div>

<?php
// Mostrar botón "Firmar Contrato" solo si el usuario en sesión es el vendedor del contrato
// y el contrato NO está completado
if ($_SESSION['id_usuario'] == $contrato['id_vendedor']
    && $contrato['estado_contrato'] !== 'completado'
) : 
?>
    <div class="text-center mt-3">
        <form method="POST">
            <button type="submit" class="btn btn-success" formaction="../api/contract_signing_process.php?id=<?php echo $idContrato; ?>">
                Firmar Contrato
            </button>
            <input type="hidden" name="estado_contrato" value="completado">
        </form>
    </div>
<?php endif; ?>

<?php
// Mostrar el botón "Realizar pago" solo si el contrato está completado y el usuario es el comprador
if ($_SESSION['id_usuario'] != $contrato['id_vendedor']
    && $contrato['estado_contrato'] === 'completado'
    && $vehiculo['estado'] !== 'vendido'
) : 
?>
    <div class="text-center mt-3">
        <form method="POST">
            <button type="submit" class="btn btn-success" formaction="../api/sale_vehicle_process.php?id=<?php echo $idContrato; ?>">
                Realizar pago
            </button>
            <input type="hidden" name="estado_vehiculo" value="vendido">
        </form>
    </div>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>
