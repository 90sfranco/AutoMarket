// File: assets/js/contracts.js
document.addEventListener('DOMContentLoaded', function() {
    const loadingIndicator   = document.getElementById('loadingIndicator');
    const contractsContainer = document.getElementById('contractsContainer');
    const noContractsMessage = document.getElementById('noContractsMessage');

    async function loadContracts() {
        try {
            // Mostrar spinner y ocultar contenido
            loadingIndicator.classList.remove('d-none');
            contractsContainer.style.display = 'none';
            noContractsMessage.classList.add('d-none');

            // Añadir un pequeño retraso mínimo para asegurar que el spinner sea visible
            const fetchPromise = fetch(`../../api/contratos_list.php`);
            
            // Forzar un tiempo mínimo de carga para que el spinner sea siempre visible (300ms mínimo)
            const [response] = await Promise.all([
                fetchPromise,
                new Promise(resolve => setTimeout(resolve, 300))
            ]);
            
            const contracts = await response.json();

            // Ocultar el spinner siempre al final del proceso
            loadingIndicator.classList.add('d-none');

            // Si no hay contratos
            if (!Array.isArray(contracts) || contracts.length === 0) {
                noContractsMessage.classList.remove('d-none');
                return;
            }

            // Hay contratos: renderizar tarjetas
            contractsContainer.innerHTML = '';
            contractsContainer.style.display = 'flex';

            contracts.forEach(contrato => {
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-center">Contrato ATM${contrato.id_contrato}</h5>
                            <p class="card-text">
                                <strong>Comprador:</strong> ${contrato.comprador_nombre}<br>
                                <strong>Vehículo:</strong> ${contrato.vehiculo_marca} ${contrato.vehiculo_modelo} (${contrato.vehiculo_anio})<br>
                                <strong>Estado:</strong> ${contrato.estado_contrato}<br>
                                <strong>Fecha:</strong> ${new Date(contrato.fecha_creacion).toLocaleDateString()}
                            </p>
                        </div>
                        <div class="card-footer text-center bg-white">
                            <a href="../../views/contract_detail.php?id=${contrato.id_contrato}" class="btn btn-secondary">Ver Detalle</a>
                        </div>
                    </div>
                `;
                contractsContainer.appendChild(col);
            });

        } catch (error) {
            console.error('Error al obtener contratos:', error);
            loadingIndicator.classList.add('d-none');
            noContractsMessage.textContent = 'Ocurrió un error al cargar los contratos.';
            noContractsMessage.classList.remove('d-none');
        }
    }

    loadContracts();
});