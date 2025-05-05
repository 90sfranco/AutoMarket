<?php include '../includes/header.php'; ?>

<h2 class="fs-2 mb-3 text-center">Historial de Contratos</h2>

<!-- Indicador de carga -->
<div id="loadingIndicator"
      class="d-flex justify-content-center align-items-center">
  <div class="spinner-border text-primary"
        role="status"
        aria-label="Cargando contratos">
    <span class="visually-hidden">Cargando...</span>
  </div>
</div>

<!-- Mensaje cuando no hay contratos -->
<div id="noContractsMessage"
      class="d-none text-center alert alert-info"
      style="margin-top: 50px; max-width: 30%; margin: 0 auto;">
  No se encontraron contratos 🔎.
</div>

<!-- Contenedor de tarjetas -->
<div id="contractsContainer" class="row row-cols-1 row-cols-md-3 g-4" style="margin-top: 50px; display: none;"></div>

<script src="../assets/js/contracts.js"></script>
<?php include '../includes/footer.php'; ?>
