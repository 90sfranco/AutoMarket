<?php
include '../includes/config.php';


$idUsuario = $_SESSION['id_usuario'];
$endpoint = CONTRACTS_SERVICE_URL . '/user/' . $idUsuario;
function obtenerContratos($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $respuesta = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpCode === 200 && $respuesta) {
        return json_decode($respuesta, true);
    }
    return [];
}
$contratos = obtenerContratos($endpoint);
?>

<?php include '../includes/header.php'; ?>

<h2 class="fs-2 mb-3 text-center">Historial de Contratos</h2>

<div id="noContractsMessage"
     class="d-none text-center alert alert-info"
     style="margin-top: 50px; max-width: 30%; margin: 0 auto;">
  No se encontraron contratos 🔎.
</div>

<div id="contractsContainer"
     class="row row-cols-1 row-cols-md-3 g-4"
     style="margin-top: 50px; display: none;">
</div>

<div class="text-center my-4">
  <button id="showMoreBtn" class="btn btn-secondary d-none">
    Mostrar más
  </button>
</div>

<script>
  window.contractsData = <?php echo json_encode($contratos, JSON_HEX_TAG); ?>;
</script>
<script src="../assets/js/contracts.js"></script>

<?php include '../includes/footer.php'; ?>
