<?php
// C:\xampp\htdocs\automarketweb\views\vehicle_sale_edit.php

include '../includes/config.php';
include '../includes/header.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Mostrar mensajes de feedback, si existen
$alertHtml = "";
if (isset($_GET['msg'])) {
    if ($_GET['msg'] === 'success-vehicle-updated') {
        $alertHtml = '<div id="alert-container" class="alert alert-success">Vehículo editado con éxito.</div>';
    } elseif ($_GET['msg'] === 'error-vehicle-no-updated') {
        $alertHtml = '<div id="alert-container" class="alert alert-danger">Error al editar el vehículo.</div>';
    }
}
echo $alertHtml;

// Verificar que se haya pasado el id del vehículo
if (!isset($_GET['id'])) {
    echo '<div class="alert alert-danger">No se ha especificado el vehículo a editar.</div>';
    include '../includes/footer.php';
    exit;
}

$vehicleId = (int)$_GET['id'];
$url = VEHICLES_QUERIES_SERVICE_URL . '/' . $vehicleId;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode != 200) {
    echo '<div class="alert alert-danger">No se encontró el vehículo.</div>';
    include '../includes/footer.php';
    exit;
}

$vehicle = json_decode($response, true);

?>
<div class="card p-4 shadow-sm">
  <h2 class="mb-4">Editar Vehículo</h2>
  <form method="POST" action="../api/vehicle_sale_edit_process.php">
    <!-- Campo oculto para el ID del vehículo -->
    <input type="hidden" name="id_vehiculo" value="<?php echo htmlspecialchars($vehicle['id_vehiculo']); ?>">
    <div class="mb-3">
      <label for="marca" class="form-label">Marca</label>
      <input type="text" class="form-control" id="marca" name="marca" required value="<?php echo htmlspecialchars($vehicle['marca']); ?>">
    </div>
    <div class="mb-3">
      <label for="anio" class="form-label">Año</label>
      <input type="number" class="form-control" id="anio" name="anio" required value="<?php echo htmlspecialchars($vehicle['anio']); ?>">
    </div>
    <div class="mb-3">
      <label for="modelo" class="form-label">Modelo</label>
      <input type="text" class="form-control" id="modelo" name="modelo" required value="<?php echo htmlspecialchars($vehicle['modelo']); ?>">
    </div>
    <div class="mb-3">
      <label for="kilometraje" class="form-label">Kilometraje</label>
      <input type="number" class="form-control" id="kilometraje" name="kilometraje" required value="<?php echo htmlspecialchars($vehicle['kilometraje']); ?>">
    </div>
    <div class="mb-3">
      <label for="tipo_carroceria" class="form-label">Tipo Carrocería</label>
      <input type="text" class="form-control" id="tipo_carroceria" name="tipo_carroceria" required value="<?php echo htmlspecialchars($vehicle['tipoCarroceria'] ?? $vehicle['tipo_carroceria']); ?>">
    </div>
    <div class="mb-3">
      <label for="num_cilindros" class="form-label">Número de Cilindros</label>
      <input type="number" class="form-control" id="num_cilindros" name="num_cilindros" required value="<?php echo htmlspecialchars($vehicle['numCilindros'] ?? $vehicle['num_cilindros']); ?>">
    </div>
    <div class="mb-3">
      <label for="transmision" class="form-label">Transmisión</label>
      <input type="text" class="form-control" id="transmision" name="transmision" required value="<?php echo htmlspecialchars($vehicle['transmision']); ?>">
    </div>
    <div class="mb-3">
      <label for="tren_traction" class="form-label">Tren de Tracción</label>
      <input type="text" class="form-control" id="tren_traction" name="tren_traction" required value="<?php echo htmlspecialchars($vehicle['trenTraction'] ?? $vehicle['tren_traction']); ?>">
    </div>
    <div class="mb-3">
      <label for="color_interior" class="form-label">Color Interior</label>
      <input type="text" class="form-control" id="color_interior" name="color_interior" required value="<?php echo htmlspecialchars($vehicle['colorInterior'] ?? $vehicle['color_interior']); ?>">
    </div>
    <div class="mb-3">
      <label for="color_exterior" class="form-label">Color Exterior</label>
      <input type="text" class="form-control" id="color_exterior" name="color_exterior" required value="<?php echo htmlspecialchars($vehicle['colorExterior'] ?? $vehicle['color_exterior']); ?>">
    </div>
    <div class="mb-3">
      <label for="num_pasajeros" class="form-label">Número de Pasajeros</label>
      <input type="number" class="form-control" id="num_pasajeros" name="num_pasajeros" required value="<?php echo htmlspecialchars($vehicle['numPasajeros'] ?? $vehicle['num_pasajeros']); ?>">
    </div>
    <div class="mb-3">
      <label for="num_puertas" class="form-label">Número de Puertas</label>
      <input type="number" class="form-control" id="num_puertas" name="num_puertas" required value="<?php echo htmlspecialchars($vehicle['numPuertas'] ?? $vehicle['num_puertas']); ?>">
    </div>
    <div class="mb-3">
      <label for="tipo_combustible" class="form-label">Tipo de Combustible</label>
      <input type="text" class="form-control" id="tipo_combustible" name="tipo_combustible" required value="<?php echo htmlspecialchars($vehicle['tipoCombustible'] ?? $vehicle['tipo_combustible']); ?>">
    </div>
    <div class="mb-3">
      <label for="precio" class="form-label">Precio</label>
      <input type="number" step="0.01" class="form-control" id="precio" name="precio" required value="<?php echo htmlspecialchars($vehicle['precio']); ?>">
    </div>
    <!-- Eliminamos el campo de "estado", ya que no lo define el usuario -->
    <input type="hidden" name="estado" value="disponible">
    <input type="hidden" name="id_usuario" value="<?php echo $_SESSION['id_usuario'] ?? 0; ?>">
    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
  </form>
</div>

<!-- Script para ocultar el mensaje de alerta después de 3 segundos y limpiar solo el parámetro "msg" -->
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
          
          // Redirección después de eliminar la alerta
          if (window.location.search.includes('msg=')) {
            // Limpiar parámetros de URL sin recargar
            var newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            
            window.location.href = '../views/vehicle_sale.php'; 
          }
        }, 500);
      }
    }, 1000); // Tiempo antes de ocultar (2 segundos)
  });
</script>

<?php include '../includes/footer.php'; ?>
