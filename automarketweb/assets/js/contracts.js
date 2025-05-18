document.addEventListener('DOMContentLoaded', function () {
  const loadingIndicator   = document.getElementById('loadingIndicator');
  const contractsContainer = document.getElementById('contractsContainer');
  const noContractsMessage = document.getElementById('noContractsMessage');

  /* ---------- utilidades para el estado ---------- */
  // Mapea cada estado (en minúsculas) a la clase bg- de Bootstrap
  const statusMap = {
    'en proceso': 'info',
    completado:   'success',
    cancelado:    'danger'
  };

  // Devuelve el <span> formateado con badge y texto capitalizado
  function formatEstado(estadoRaw) {
    const key = estadoRaw.toLowerCase();          // normalizar para el mapa
    const badge = statusMap[key] || 'secondary';  // color por defecto
    // Capitalizar cada palabra
    const texto = key
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `<span class="badge bg-${badge} rounded-pill">${texto}</span>`;
  }
  /* ------------------------------------------------ */

  async function loadContracts() {
    try {
      // mostrar spinner
      loadingIndicator.classList.remove('d-none');
      contractsContainer.style.display = 'none';
      noContractsMessage.classList.add('d-none');

      // fetch + delay mínimo
      const fetchPromise = fetch('../../api/contratos_list.php');
      const [response] = await Promise.all([
        fetchPromise,
        new Promise(r => setTimeout(r, 300))
      ]);
      const contracts = await response.json();

      // ocultar spinner
      loadingIndicator.classList.add('d-none');

      // si no hay contratos
      if (!Array.isArray(contracts) || !contracts.length) {
        noContractsMessage.classList.remove('d-none');
        return;
      }

      // limpiar y mostrar contenedor
      contractsContainer.innerHTML = '';
      contractsContainer.style.display = '';

      // renderizar tarjetas
      contracts.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title text-center">
                Contrato ATM${c.id_contrato}
              </h5>
              <p class="card-text">
                <strong>Comprador:</strong> ${c.comprador_nombre}<br>
                <strong>Vehículo:</strong> ${c.vehiculo_marca}
                  ${c.vehiculo_modelo} (${c.vehiculo_anio})<br>
                <strong>Estado:</strong> ${formatEstado(c.estado_contrato)}<br>
                <strong>Fecha:</strong>
                  ${new Date(c.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
            <div class="card-footer text-center bg-white">
              <a href="../../views/contract_detail.php?id=${c.id_contrato}"
                 class="btn btn-outline-secondary">
                Ver Detalle
              </a>
            </div>
          </div>
        `;
        contractsContainer.appendChild(col);
      });

    } catch (error) {
      console.error('Error al obtener contratos:', error);
      loadingIndicator.classList.add('d-none');
      noContractsMessage.textContent =
        'Ocurrió un error al cargar los contratos.';
      noContractsMessage.classList.remove('d-none');
    }
  }

  loadContracts();
});
