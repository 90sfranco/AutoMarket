<?php 
include '../includes/header.php'; 
?>

<div class="cards-container">
  <a href="../views/analisis.php" class="card-custom" title="Ir a Análisis descriptivo">
    <img src="../assets/images/vehicles-logo.png" alt="Análisis" class="card-icon" />
    <h3 class="card-title">Análisis de vehiculos</h3>
    <p class="card-subtitle">
      Consulta gráficas y reportes del servicio de vehículos para entender el comportamiento y tendencias.
    </p>
  </a>

<a href="http://localhost:8080" target="_blank" class="card-custom" title="Ir a Kafka UI" rel="noopener noreferrer">
  <img src="../assets/images/kafka-ui-logo.png" alt="Kafka UI" class="card-icon" />
  <h3 class="card-title">Kafka UI</h3>
  <p class="card-subtitle">
    Interfaz de administración y monitoreo de Kafka para el servicio de vehículos.
  </p>
</a>
<a href="http://localhost:9500" class="card-custom" title="Ir a Grafana Metrics" >
  <img src="../assets/images/grafana-logo.png" alt="Kafka UI" class="card-icon" />
  <h3 class="card-title">Grafana Metrics</h3>
  <p class="card-subtitle">
    Interfaz de administración y monitoreo de Grafana.
  </p>
</a>
</div>