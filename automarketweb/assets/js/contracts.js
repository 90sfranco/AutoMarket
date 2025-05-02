document.addEventListener('DOMContentLoaded', function() {
    const contractsContainer = document.getElementById('contractsContainer');
    const noContractsMessage = document.getElementById('noContractsMessage');

    async function loadContracts() {
        try {
            const response = await fetch(`../../api/contratos_list.php`);
            const contracts = await response.json();
            contractsContainer.innerHTML = "";

            if (!Array.isArray(contracts) || contracts.length === 0) {
                noContractsMessage.classList.remove('d-none'); // Mostrar mensaje
                contractsContainer.classList.add('d-none'); // Ocultar contenedor de tarjetas
                return;
            }

            // Ocultar el mensaje si hay contratos
            noContractsMessage.classList.add('d-none');
            contractsContainer.classList.remove('d-none');

            // Cuando hay contratos, mostrar las tarjetas
            contracts.forEach(contrato => {
                const col = document.createElement('div');
                col.className = 'col'; // Este asegura que cada tarjeta esté en una columna
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
                            <a href="../../views/contract_detail.php?id=${contrato.id_contrato}" class="btn btn-primary">Ver Detalle</a>
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
