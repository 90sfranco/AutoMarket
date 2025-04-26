<?php 
include '../includes/header.php'; 
include '../includes/config.php'; 
?>

<?php
// Obtener el id del vehículo desde GET
$idVehiculo = isset($_GET['id']) ? $_GET['id'] : null;
if (!$idVehiculo) {
    echo "<p class='text-danger text-center'>No se especificó un vehículo.</p>";
    include '../includes/footer.php';
    exit();
}

// Obtener información del vehículo desde el microservicio de vehículos
$urlVehicle = VEHICLES_QUERIES_SERVICE_URL . '/' . $idVehiculo;
$ch = curl_init($urlVehicle);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$responseVehicle = curl_exec($ch);
$httpCodeVehicle = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCodeVehicle != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el vehículo con id $idVehiculo.</p>";
    include '../includes/footer.php';
    exit();
}

$vehiculo = json_decode($responseVehicle, true);
if (!$vehiculo) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del vehículo.</p>";
    include '../includes/footer.php';
    exit();
}

// Obtener información del comprador (usuario en sesión)
if (!isset($_SESSION['id_usuario'])) {
    echo "<p class='text-danger text-center'>Usuario no autenticado.</p>";
    include '../includes/footer.php';
    exit();
}
$idComprador = $_SESSION['id_usuario'];
$urlBuyer = USERS_SERVICE_URL . '/' . $idComprador;
$ch = curl_init($urlBuyer);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$responseBuyer = curl_exec($ch);
$httpCodeBuyer = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($httpCodeBuyer != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el comprador.</p>";
    include '../includes/footer.php';
    exit();
}
$comprador = json_decode($responseBuyer, true);
if (!$comprador) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del comprador.</p>";
    include '../includes/footer.php';
    exit();
}

// Obtener información del vendedor usando el id del usuario del vehículo
$idVendedor = $vehiculo['id_usuario'];
$urlSeller = USERS_SERVICE_URL . '/' . $idVendedor;
$ch = curl_init($urlSeller);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$responseSeller = curl_exec($ch);
$httpCodeSeller = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($httpCodeSeller != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el vendedor.</p>";
    include '../includes/footer.php';
    exit();
}
$vendedor = json_decode($responseSeller, true);
if (!$vendedor) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del vendedor.</p>";
    include '../includes/footer.php';
    exit();
}
?>

<h2 class="fs-2 mb-4 text-center">Confirmar Contrato de Compraventa</h2>

<div class="card mb-4 mx-auto" style="max-width: 60rem; background-color: #f9f9f9; border: 1px solid #ccc;">
    <div class="card-body">
        <div class="row">
            <!-- Información del Comprador -->
            <div class="col-md-4 border-end">
                <h5 class="text-center">Comprador</h5>
                <p><strong>Nombre:</strong> <?php echo htmlspecialchars($comprador['nombre']); ?></p>
                <p><strong>Email:</strong> <?php echo htmlspecialchars($comprador['email']); ?></p>
                <p><strong>Identificación:</strong> <?php echo htmlspecialchars($comprador['identificacion']); ?></p>
            </div>
            <!-- Información del Vendedor -->
            <div class="col-md-4 border-end">
                <h5 class="text-center">Vendedor</h5>
                <p><strong>Nombre:</strong> <?php echo htmlspecialchars($vendedor['nombre']); ?></p>
                <p><strong>Email:</strong> <?php echo htmlspecialchars($vendedor['email']); ?></p>
                <p><strong>Identificación:</strong> <?php echo htmlspecialchars($vendedor['identificacion']); ?></p>
            </div>
            <!-- Información del Vehículo -->
            <div class="col-md-4">
                <h5 class="text-center">Vehículo</h5>
                <p><strong>Marca/Modelo:</strong> <?php echo htmlspecialchars($vehiculo['marca']) . " " . htmlspecialchars($vehiculo['modelo']); ?></p>
                <p><strong>Año:</strong> <?php echo htmlspecialchars($vehiculo['anio']); ?></p>
                <p><strong>Kilometraje:</strong> <?php echo htmlspecialchars($vehiculo['kilometraje']); ?></p>
                <p><strong>Precio:</strong> $<?php echo number_format($vehiculo['precio'], 2); ?></p>
                <p><strong>Estado:</strong> <?php echo ucfirst(htmlspecialchars($vehiculo['estado'])); ?></p>
            </div>
        </div>
        <hr>
        <!-- Formulario para ingresar condiciones de pago -->
        <form action="/automarketweb/api/contract_process.php?id=<?php echo $vehiculo['id_vehiculo']; ?>" method="POST">
            <div class="mb-3">
                <label for="condiciones_pago" class="form-label">Condiciones de Pago</label>
                <textarea id="condiciones_pago" name="condiciones_pago" class="form-control" rows="4" placeholder="Ej: Pago de contado mediante transferencia bancaria" required></textarea>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-success">Confirmar Contrato</button>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>
