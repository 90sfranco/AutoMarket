document.addEventListener('DOMContentLoaded', function() {
  const contractsContainer   = document.getElementById('contractsContainer');
  const showMoreBtn          = document.getElementById('showMoreBtn');
  const noContractsMessage   = document.getElementById('noContractsMessage');
  const loadingIndicator     = document.getElementById('loadingIndicator');
  let showLessBtn            = null;
  let contracts              = window.contractsData || [];
  let displayedCount         = 0;

  /* Ocultar spinner inmediatamente */
  if (loadingIndicator) {
    loadingIndicator.classList.add('d-none');
  }

  /* Ocultar mensaje de "no contratos" hasta comprobar */
  if (noContractsMessage) {
    noContractsMessage.classList.add('d-none');
  }

  /* ---------- utilidades para el estado ---------- */
  const statusMap = {
    'en proceso': 'warning',
    'completado':   'success',
    'cancelado':    'danger'
  };

  function formatEstado(estadoRaw) {
    const key   = estadoRaw.toLowerCase();
    const badge = statusMap[key] || 'secondary';
    const texto = key
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `<span class="badge bg-${badge} rounded-pill">${texto}</span>`;
  }
  /* ------------------------------------------------ */

  // Si no hay contratos, mostrar mensaje y ocultar botón
  if (!Array.isArray(contracts) || contracts.length === 0) {
    noContractsMessage.classList.remove('d-none');
    showMoreBtn.classList.add('d-none');
    return;
  }

  // Mostrar contenedor y botón
  contractsContainer.style.display = '';
  showMoreBtn.classList.remove('d-none');

  function displayContracts(count) {
    const end = Math.min(displayedCount + count, contracts.length);
    for (let i = displayedCount; i < end; i++) {
      const c = contracts[i];
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
          <div class="card-footer text-center">
            <a href="../../views/contract_detail.php?id=${c.id_contrato}"
               class="btn btn-outline-secondary">
              Ver Detalle
            </a>
          </div>
        </div>
      `;
      contractsContainer.appendChild(col);
    }
    displayedCount = end;
    updateButtons();
  }

  function updateButtons() {
    if (displayedCount > 3 && !showLessBtn) {
      showLessBtn = document.createElement('button');
      showLessBtn.className = 'btn btn-secondary ms-2';
      showLessBtn.textContent = 'Mostrar menos';
      showLessBtn.addEventListener('click', resetContracts);
      showMoreBtn.parentNode.insertBefore(showLessBtn, showMoreBtn.nextSibling);
    }
    if (displayedCount === 3 && showLessBtn) {
      showLessBtn.remove();
      showLessBtn = null;
    }
    // Mostrar/ocultar botón según queden contratos
    if (displayedCount >= contracts.length) {
      showMoreBtn.classList.add('d-none');
    } else {
      showMoreBtn.classList.remove('d-none');
    }
  }

  function resetContracts() {
    contractsContainer.innerHTML = "";
    displayedCount = 0;
    displayContracts(3);
  }

  showMoreBtn.addEventListener('click', () => displayContracts(3));

  // Arranca mostrando las primeras 3
  displayContracts(3);
});
