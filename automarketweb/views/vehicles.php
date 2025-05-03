<?php 
include '../includes/config.php';
include '../includes/header.php';

// Obtener fecha actual y hace 7 días, en formato YYYY-MM-DD
$hoy = date('Y-m-d');
$hace_una_semana = date('Y-m-d', strtotime('-7 days'));

// Si se envía el formulario, usamos sus valores; si no, usamos los predeterminados
$filters = [
    'marca' => $_POST['marca'] ?? null,
    'precio_min' => $_POST['precio_min'] ?? null,
    'precio_max' => $_POST['precio_max'] ?? null,
    'fecha_inicial' => $_POST['fecha_inicial'] ?? $hace_una_semana,
    'fecha_final' => $_POST['fecha_final'] ?? $hoy,
    'anio' => $_POST['anio'] ?? null
];

// Preparamos el body JSON para la solicitud al microservicio filtrado.
$data = json_encode([
    "marca" => $filters['marca'],
    "precio_inicial" => $filters['precio_min'],
    "precio_final" => $filters['precio_max'],
    "fecha_inicial" => $filters['fecha_inicial'],
    "fecha_final" => $filters['fecha_final'],
    "anio" => $filters['anio']
]);

// Usamos cURL para consumir el servicio filtrado.
$url = VEHICLES_QUERIES_SERVICE_URL . '/get-filtered';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
]);
$response = curl_exec($ch);
curl_close($ch);

$vehicles = json_decode($response, true);
if (!$vehicles) {
    $vehicles = [];
}
?>
<h2 class="fs-2 mb-3">Vehículos en Venta</h2>

<!-- Formulario de filtro (envía a esta misma página mediante POST) -->
<form id="filterForm" action="" method="POST" class="mb-4">
    <div class="row g-3 mb-2">
        <div class="col-md-4">
            <label for="marca" class="form-label">Marca</label>
            <input type="text" id="marca" name="marca" class="form-control" placeholder="Ej: Toyota" value="<?php echo htmlspecialchars($filters['marca'] ?? ''); ?>">
        </div>
        <div class="col-md-4">
            <label for="anio" class="form-label">Año</label>
            <input type="number" id="anio" name="anio" class="form-control" placeholder="Ej: 2023" value="<?php echo htmlspecialchars($filters['anio']); ?>">
        </div>
        <div class="col-md-4">
            <label for="precio_min" class="form-label">Precio Mínimo</label>
            <input type="number" id="precio_min" name="precio_min" class="form-control" placeholder="0" value="<?php echo htmlspecialchars($filters['precio_min']); ?>">
        </div>
    </div>
    <div class="row g-3">
        <div class="col-md-4">
            <label for="precio_max" class="form-label">Precio Máximo</label>
            <input type="number" id="precio_max" name="precio_max" class="form-control" placeholder="100000000" value="<?php echo htmlspecialchars($filters['precio_max']); ?>">
        </div>
        <div class="col-md-4">
            <label for="fecha_inicial" class="form-label">Fecha desde</label>
            <input type="date" id="fecha_inicial" name="fecha_inicial" class="form-control" value="<?php echo htmlspecialchars($filters['fecha_inicial']); ?>">
        </div>
        <div class="col-md-4">
            <label for="fecha_final" class="form-label">Fecha hasta</label>
            <input type="date" id="fecha_final" name="fecha_final" class="form-control" value="<?php echo htmlspecialchars($filters['fecha_final']); ?>">
        </div>
    </div>
    <div class="mt-3">
        <button type="submit" class="btn btn-secondary">Filtrar</button>
        <button type="button" id="clearFilterBtn" class="btn btn-outline-secondary ms-2" onclick="window.location.href='vehicles.php'">Limpiar Filtro</button>
    </div>
</form>

<!-- Contenedor para las tarjetas de vehículos -->
<div id="vehiclesContainer" class="row row-cols-1 row-cols-md-3 g-4"></div>

<!-- Botón para cargar más vehículos -->
<div class="text-center mt-4">
    <button id="showMoreBtn" class="btn btn-secondary">Mostrar más</button>
</div>

<?php include '../includes/footer.php'; ?>

<!-- Pasamos los vehículos obtenidos desde PHP a JavaScript -->
<script>
    var vehiclesData = <?php echo json_encode($vehicles); ?>;
</script>
<!-- Cargar el script de paginación y renderizado -->
<script src="../assets/js/vehicles.js"></script>
