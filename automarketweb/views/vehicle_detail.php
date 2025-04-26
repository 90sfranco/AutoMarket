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

$id_usuario = null;

if (!isset($_SESSION['id_usuario'])) {
    $id_usuario = null;
}else{
    $id_usuario = $_SESSION['id_usuario'];
}


// Construir la URL del microservicio de vehículos para obtener los detalles
$url = VEHICLES_QUERIES_SERVICE_URL . '/' . $idVehiculo;

// Inicializar cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Verificar que la respuesta fue exitosa (HTTP 200)
if ($httpCode != 200) {
    echo "<p class='text-danger text-center'>No se encontró información para el vehículo con id $idVehiculo.</p>";
    include '../includes/footer.php';
    exit();
}

// Convertir la respuesta JSON en un array asociativo
$vehiculo = json_decode($response, true);

// Si no se pudo decodificar o no se encontró el vehículo
if (!$vehiculo) {
    echo "<p class='text-danger text-center'>Error al obtener los datos del vehículo.</p>";
    include '../includes/footer.php';
    exit();
}
?>

<h2 class="fs-2 mb-3 text-center">Detalle del Vehículo</h2>

<div class="card mb-4 mx-auto" style="max-width: 60rem; background-color: #f9f9f9; border: 1px solid #ccc;">
    <div class="row g-0">
        <!-- Columna con la imagen difuminada -->
        <div class="col-md-4 p-0">
            <img src="../assets/images/logo.jpeg"
                 alt="Imagen del vehículo"
                 style="
                     width: 100%;
                     height: 100%;
                     object-fit: cover;
                     filter: blur(0px) brightness(0.9);
                 ">
        </div>

        <!-- Columna de la información -->
        <div class="col-md-8">
            <div class="card-body p-4">
                <h4 class="card-title mb-4 text-center" style="color: #444;">
                    <?php echo htmlspecialchars($vehiculo['marca']) . " " . htmlspecialchars($vehiculo['modelo']); ?>
                </h4>

                <div class="row">
                    <!-- Primera columna de datos -->
                    <div class="col-md-6 mb-3">
                        <p class="mb-2">
                            <strong>Año:</strong> <?php echo htmlspecialchars($vehiculo['anio']); ?><br>
                            <strong>Kilometraje:</strong> <?php echo htmlspecialchars($vehiculo['kilometraje']); ?><br>
                            <strong>Precio:</strong> 
                            $<?php echo number_format($vehiculo['precio'], 2); ?><br>
                            <strong>Estado:</strong> 
                            <?php echo ucfirst(htmlspecialchars($vehiculo['estado'])); ?><br>
                            <strong>Tipo de Carrocería:</strong> 
                            <?php echo htmlspecialchars($vehiculo['tipo_carroceria']); ?><br>
                        </p>
                    </div>
                    <!-- Segunda columna de datos -->
                    <div class="col-md-6 mb-3">
                        <p class="mb-2">
                            <strong>Número de Cilindros:</strong> 
                            <?php echo htmlspecialchars($vehiculo['num_cilindros']); ?><br>
                            <strong>Transmisión:</strong> 
                            <?php echo htmlspecialchars($vehiculo['transmision']); ?><br>
                            <strong>Tren de Tracción:</strong> 
                            <?php echo htmlspecialchars($vehiculo['tren_traction']); ?><br>
                            <strong>Color Interior:</strong> 
                            <?php echo htmlspecialchars($vehiculo['color_interior']); ?><br>
                            <strong>Color Exterior:</strong> 
                            <?php echo htmlspecialchars($vehiculo['color_exterior']); ?><br>
                        </p>
                    </div>
                </div>

                <div class="row">
                    <!-- Tercera columna de datos -->
                    <div class="col-md-6 mb-3">
                        <p class="mb-2">
                            <strong>Número de Pasajeros:</strong> 
                            <?php echo htmlspecialchars($vehiculo['num_pasajeros']); ?><br>
                            <strong>Número de Puertas:</strong> 
                            <?php echo htmlspecialchars($vehiculo['num_puertas']); ?><br>
                        </p>
                    </div>
                    <!-- Cuarta columna de datos -->
                    <div class="col-md-6 mb-3">
                        <p class="mb-2">
                            <strong>Tipo de Combustible:</strong> 
                            <?php echo htmlspecialchars($vehiculo['tipo_combustible']); ?><br>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Botón de compra si está disponible -->
<div class="text-center">
    <?php if ($vehiculo['estado'] == 'disponible'): ?>
        <?php if ($vehiculo['id_usuario'] != $id_usuario): ?>
            <a href="/automarketweb/views/contract.php?id=<?php echo $vehiculo['id_vehiculo']; ?>" class="btn btn-success">Comprar Vehículo</a>
        <?php else: ?>
            <p class="text-success">Usted es el vendedor de este vehículo.</p>
        <?php endif; ?>
    <?php else: ?>
        <p class="text-danger">Este vehículo ya ha sido vendido.</p>
    <?php endif; ?>
</div>



<?php include '../includes/footer.php'; ?>
