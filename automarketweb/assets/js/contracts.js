document.addEventListener('DOMContentLoaded', function() {
    const contractsContainer = document.getElementById('contractsContainer');

    async function loadContracts() {
        try {
            const response = await fetch(`/automarketweb/api/contratos_list.php`);
            const contracts = await response.json();
            contractsContainer.innerHTML = "";

            if (!Array.isArray(contracts) || contracts.length === 0) {
                contractsContainer.innerHTML = `<div class="alert alert-info text-center">No se encontraron contratos.</div>`;
                return;
            }

            contracts.forEach(contrato => {
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title text-center">Contrato ATM${contrato.id_contrato}</h5>
                            <p class="card-text">
                                Comprador: ${contrato.comprador_nombre} <br>
                                Vehículo: ${contrato.vehiculo_marca} ${contrato.vehiculo_modelo} (${contrato.vehiculo_anio})<br>
                                Estado: <strong>${contrato.estado_contrato}</strong> <br>
                                Fecha: ${new Date(contrato.fecha_creacion).toLocaleDateString()}
                            </p>
                        </div>
                        <div class="card-footer text-center">
                            <a href="/automarketweb/views/contract_detail.php?id=${contrato.id_contrato}" class="btn btn-primary">Ver Detalle</a>
                        </div>
                    </div>
                `;
                contractsContainer.appendChild(col);
            });
        } catch (error) {
            console.error('Error al obtener contratos:', error);
        }
    }

    loadContracts();
});
