<?php
include '../includes/config.php';
include '../includes/header.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start();
}

// Obtener los vehículos publicados del usuario mediante cURL
$sales = [];
$userId = $_SESSION['id_usuario'] ?? 0;
$url = VEHICLES_QUERIES_SERVICE_URL . '/when-user/' . $userId;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    $sales = json_decode($response, true);
}

// Mostrar mensajes de feedback, si existen
$alertHtml = "";
if (isset($_GET['msg'])) {
    $msg = $_GET['msg'];
    if ($msg === 'success-vehicle-created') {
        $alertHtml = '<div id="alert-container" class="alert alert-success">Vehículo publicado con éxito.</div>';
    } elseif ($msg === 'error-vehicle-no-created') {
        $alertHtml = '<div id="alert-container" class="alert alert-danger">Error al publicar el vehículo.</div>';
    } elseif ($msg === 'success-vehicle-deleted') {
        $alertHtml = '<div id="alert-container" class="alert alert-success">Publicación eliminada con éxito.</div>';
    } elseif (strpos($msg, 'error-vehicle-no-deleted:') === 0) {
        // Extraer el mensaje de error después del prefijo
        $errorMessage = trim(substr($msg, strlen("error-vehicle-no-deleted:")));
        if (empty($errorMessage)) {
            $errorMessage = "Error al eliminar la publicación.";
        }
        $alertHtml = '<div id="alert-container" class="alert alert-danger">' . htmlspecialchars($errorMessage) . '</div>';
    } elseif ($msg === 'invalid_user') {
        $alertHtml = '<div id="alert-container" class="alert alert-warning">Usuario inválido. Inicia sesión para continuar.</div>';
    }
}
echo $alertHtml;
?>

<!-- Resto del código para mostrar los vehículos y el formulario se mantiene sin cambios -->

<div class="row">
  <!-- Listado de Vehículos Publicados -->
  <div class="col-md-6">
    <h2 class="mb-4">Tus Vehículos Publicados</h2>
    <?php if (!empty($sales)): ?>
      <?php foreach ($sales as $sale): ?>
        <div class="card mb-3 shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title"><?php echo htmlspecialchars($sale['marca']); ?> <?php echo htmlspecialchars($sale['modelo']); ?></h5>
              <p class="card-text">
                <strong>Año:</strong> <?php echo htmlspecialchars($sale['anio']); ?><br>
                <strong>Kilometraje:</strong> <?php echo htmlspecialchars($sale['kilometraje']); ?><br>
                <strong>Precio:</strong> $<?php echo htmlspecialchars($sale['precio']); ?> <br>
                <strong>Estado:</strong> <?php echo htmlspecialchars($sale['estado']); ?>
              </p>
            </div>
            <!-- Íconos para Editar y Eliminar -->
            <div class="d-flex flex-column align-items-center">
              <!-- Editar -->
              <a href="vehicle_sale_edit.php?id=<?php echo $sale['id_vehiculo']; ?>" class="mb-2" title="Editar">
                  <i class="bi bi-pencil-square fs-4" 
                     style="color: #343a40;"
                     onmouseover="this.style.color='#add8e6'" 
                     onmouseout="this.style.color='#343a40'">
                  </i>
              </a>
              <!-- Eliminar (sin confirm nativo) -->
              <a href="#" 
                 class="delete-vehicle" 
                 data-href="../api/vehicle_sale_delete.php?id=<?php echo $sale['id_vehiculo']; ?>" 
                 title="Eliminar">
                  <i class="bi bi-trash fs-4" 
                     style="color: #343a40;" 
                     onmouseover="this.style.color='#f08080'" 
                     onmouseout="this.style.color='#343a40'">
                  </i>
              </a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <p>No tienes vehículos publicados aún.</p>
    <?php endif; ?>
  </div>

  <!-- Formulario para Publicar un Nuevo Vehículo -->
  <div class="col-md-6">
    <h2 class="mb-4">Publicar Nuevo Vehículo</h2>
    <form method="POST" action="/automarketweb/api/vehicle_for_sale_process.php" class="card p-4 shadow-sm">
      <!-- Campos del formulario (igual que antes) -->
      <div class="mb-3">
        <label for="marca" class="form-label">Marca</label>
        <input type="text" class="form-control" id="marca" name="marca" required>
      </div>
      <div class="mb-3">
        <label for="anio" class="form-label">Año</label>
        <input type="number" class="form-control" id="anio" name="anio" required>
      </div>
      <div class="mb-3">
        <label for="modelo" class="form-label">Modelo</label>
        <input type="text" class="form-control" id="modelo" name="modelo" required>
      </div>
      <div class="mb-3">
        <label for="kilometraje" class="form-label">Kilometraje</label>
        <input type="number" class="form-control" id="kilometraje" name="kilometraje" required>
      </div>
      <div class="mb-3">
        <label for="tipo_carroceria" class="form-label">Tipo Carrocería</label>
        <input type="text" class="form-control" id="tipo_carroceria" name="tipo_carroceria" required>
      </div>
      <div class="mb-3">
        <label for="num_cilindros" class="form-label">Número de Cilindros</label>
        <input type="number" class="form-control" id="num_cilindros" name="num_cilindros" required>
      </div>
      <div class="mb-3">
        <label for="transmision" class="form-label">Transmisión</label>
        <input type="text" class="form-control" id="transmision" name="transmision" required>
      </div>
      <div class="mb-3">
        <label for="tren_traction" class="form-label">Tren de Tracción</label>
        <input type="text" class="form-control" id="tren_traction" name="tren_traction" required>
      </div>
      <div class="mb-3">
        <label for="color_interior" class="form-label">Color Interior</label>
        <input type="text" class="form-control" id="color_interior" name="color_interior" required>
      </div>
      <div class="mb-3">
        <label for="color_exterior" class="form-label">Color Exterior</label>
        <input type="text" class="form-control" id="color_exterior" name="color_exterior" required>
      </div>
      <div class="mb-3">
        <label for="num_pasajeros" class="form-label">Número de Pasajeros</label>
        <input type="number" class="form-control" id="num_pasajeros" name="num_pasajeros" required>
      </div>
      <div class="mb-3">
        <label for="num_puertas" class="form-label">Número de Puertas</label>
        <input type="number" class="form-control" id="num_puertas" name="num_puertas" required>
      </div>
      <div class="mb-3">
        <label for="tipo_combustible" class="form-label">Tipo de Combustible</label>
        <input type="text" class="form-control" id="tipo_combustible" name="tipo_combustible" required>
      </div>
      <div class="mb-3">
        <label for="precio" class="form-label">Precio</label>
        <input type="number" step="0.01" class="form-control" id="precio" name="precio" required>
      </div>
      <input type="hidden" name="estado"  value="disponible">
      <input type="hidden" name="id_usuario" value="<?php echo $_SESSION['id_usuario'] ?? 0; ?>">
      <button type="submit" class="btn btn-primary">Publicar Vehículo</button>
    </form>
  </div>
</div>

<!-- Script para SweetAlert2 (CDN) -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Script para el mensaje de alerta -->
<script>
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function(){
      var alertContainer = document.getElementById('alert-container');
      
      if (alertContainer) {
        // Animación de desvanecimiento
        alertContainer.style.transition = "opacity 0.5s ease-out";
        alertContainer.style.opacity = "0";
        
        // Eliminar el mensaje después de la animación
        setTimeout(function(){ 
          alertContainer.remove(); 
          
          // Limpiar el parámetro 'msg' de la URL sin recargar
          if (window.location.search.includes('msg=')) {
            var newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        }, 500);
      }
    }, 3000); // Tiempo antes de ocultar (3 segundos)
  });

  // Interceptar click en los enlaces de eliminación
  document.querySelectorAll('.delete-vehicle').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Evita la navegación inmediata
      var urlToDelete = link.getAttribute('data-href');

      // Mostrar SweetAlert de confirmación
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará la publicación de manera permanente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',   // Rojo
        cancelButtonColor: '#3085d6', // Azul
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, redirigimos a la URL de borrado
          window.location.href = urlToDelete;
        }
      });
    });
  });
</script>

<?php include '../includes/footer.php'; ?>
