<?php include '../includes/header.php'; ?>

<h2 class="fs-2 mb-3 text-center">Historial de Contratos</h2>

<!-- Contenedor para el mensaje de alerta cuando no haya contratos -->
<div id="noContractsMessage" class="d-none text-center alert alert-info" style="margin-top: 50px; width: 30%; margin-left: auto; margin-right: auto;">
    No se encontraron contratos.
</div>

<!-- Contenedor para las tarjetas de contratos -->
<div id="contractsContainer" class="row row-cols-1 row-cols-md-3 g-4" style="margin-top: 50px;"></div>

<?php include '../includes/footer.php'; ?>

<script src="../assets/js/contracts.js"></script>
