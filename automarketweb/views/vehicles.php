<?php 
include '../includes/config.php';
include '../includes/header.php';

// Si se envía el formulario, obtenemos los filtros; si no, serán null.
$filters = [
    'marca' => isset($_POST['marca']) ? $_POST['marca'] : null,
    'precio_min' => isset($_POST['precio_min']) ? $_POST['precio_min'] : null,
    'precio_max' => isset($_POST['precio_max']) ? $_POST['precio_max'] : null
];

// Preparamos el body JSON para la solicitud al microservicio filtrado.
// Si algún filtro es null, el microservicio lo ignora y devuelve todos los vehículos.
$data = json_encode([
    "marca" => $filters['marca'],
    "precio_inicial" => $filters['precio_min'],
    "precio_final" => $filters['precio_max']
]);

// Usamos cURL para consumir el servicio filtrado.
$url = VEHICLES_SERVICE_URL . '/get-filtered';
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
    <div class="row g-3">
        <div class="col-md-4">
            <label for="marca" class="form-label">Marca</label>
            <input type="text" id="marca" name="marca" class="form-control" placeholder="Ej: Toyota" value="<?php echo htmlspecialchars($filters['marca']); ?>">
        </div>
        <div class="col-md-4">
            <label for="precio_min" class="form-label">Precio Mínimo</label>
            <input type="number" id="precio_min" name="precio_min" class="form-control" placeholder="0" value="<?php echo htmlspecialchars($filters['precio_min']); ?>">
        </div>
        <div class="col-md-4">
            <label for="precio_max" class="form-label">Precio Máximo</label>
            <input type="number" id="precio_max" name="precio_max" class="form-control" placeholder="100000000" value="<?php echo htmlspecialchars($filters['precio_max']); ?>">
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
<script src="/automarketweb/assets/js/vehicles.js"></script>
