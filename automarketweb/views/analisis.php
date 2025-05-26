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
      'fecha_inicial' => $hoy,
      'fecha_final' => $hoy,
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
  if (! $vehicles) {
      $vehicles = [];
  }
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Vehicles Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Nuestro CSS personalizado -->
  <link rel="stylesheet" href="../assets/css/dashboard.css">
</head>
<body>

  <!-- Navbar con botón de modo oscuro -->
  <nav class="navbar navbar-custom py-3 position-relative">
    <div class="container-fluid">
      <span class="navbar-brand mx-auto">Dashboard Vehiculos</span>
      <button class="btn btn-outline-light toggle-switch" onclick="toggleDarkMode()">🌙</button>
    </div>
  </nav>

  <div class="container py-4">
    <!-- ====== TARJETAS SUPERIORES ====== -->
    <div class="row g-4 mb-4">
      <!-- 1) Total Vehículos -->
      <div class="col-md-3">
        <div class="card stat-card shadow">
          <div>
            <h6>Total Vehículos</h6>
            <h3 id="stat-total-vehiculos">◌</h3>
          </div>
          <div class="icon bg-primary text-white">
            <i class="bi bi-truck"></i>
          </div>
        </div>
      </div>
      <!-- 2) Total Marcas Distintas -->
      <div class="col-md-3">
        <div class="card stat-card shadow">
          <div>
            <h6>Total Marcas</h6>
            <h3 id="stat-total-marcas">◌</h3>
          </div>
          <div class="icon bg-success text-white">
            <i class="bi bi-tags"></i>
          </div>
        </div>
      </div>
      <!-- 3) Total Años Distintos -->
      <div class="col-md-3">
        <div class="card stat-card shadow">
          <div>
            <h6>Total Años</h6>
            <h3 id="stat-total-anios">◌</h3>
          </div>
          <div class="icon bg-warning text-white">
            <i class="bi bi-calendar3"></i>
          </div>
        </div>
      </div>
      <!-- 4) Total Tipos de Carrocería -->
      <div class="col-md-3">
        <div class="card stat-card shadow">
          <div>
            <h6>Tipos Carrocería</h6>
            <h3 id="stat-total-carrocerias">◌</h3>
          </div>
          <div class="icon bg-danger text-white">
            <i class="bi bi-car-front-fill"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- ====== FIN TARJETAS SUPERIORES ====== -->

<div class="row g-4 h-100">
  <!-- COL IZQUIERDA -->
  <div class="col-lg-8 h-100">
    <div class="row g-4 h-100">
      <!-- Tarjeta Marca -->
      <div class="col-md-12">
        <div class="card shadow h-100">
          <div class="card-header bg-primary text-white">Vehículos por Marca</div>
          <div class="card-body d-flex flex-column">
            <canvas id="graficoMarca"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Tarjeta Año -->
      <div class="col-md-12">
        <div class="card shadow h-100">
          <div class="card-header bg-info text-white">Vehículos por Año</div>
          <div class="card-body d-flex flex-column">
            <canvas id="graficoAnio"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- COL DERECHA (contenedor de las 2 tortas) -->
  <div class="col-lg-4 h-100">
    <div class="row g-4 h-100"> <!-- Contenedor interno para las 2 tarjetas -->
      <!-- Primera tarjeta derecha -->
      <div class="col-12">
        <div class="card shadow h-100">
          <div class="card-header bg-primary text-white">Tipo de Carrocería</div>
          <div class="card-body">
            <canvas id="graficoCarroceria"></canvas>
          </div>
        </div>
      </div>

      <!-- Segunda tarjeta derecha -->
      <div class="col-12">
        <div class="card shadow h-100">
          <div class="card-header bg-info text-white">Tipo de combustible</div>
          <div class="card-body">
            <canvas id="graficoTipoCombustible"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  <!-- Inyectamos el histórico inicial de vehículos -->
  <script>
    const initialVehicles = <?php echo json_encode($vehicles, JSON_UNESCAPED_UNICODE); ?>;
  </script>
  <!-- Cargamos nuestro JS separado -->
  <script src="../assets/js/dashboard.js"></script>

  <!-- Para usar los íconos de Bootstrap Icons (opcional) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</body>
</html>
