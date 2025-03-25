document.addEventListener('DOMContentLoaded', function() {
    const vehiclesContainer = document.getElementById('vehiclesContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');
    let showLessBtn = null;
    // Utilizamos la variable global 'vehiclesData' definida en vehicles.php
    let vehicles = vehiclesData || [];
    let displayedCount = 0;

    // Función para renderizar 'count' vehículos adicionales
    function displayVehicles(count) {
        const end = Math.min(displayedCount + count, vehicles.length);
        for (let i = displayedCount; i < end; i++) {
            const vehiculo = vehicles[i];
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
                        <p class="card-text">
                            Año: ${vehiculo.anio}<br>
                            Kilometraje: ${vehiculo.kilometraje}<br>
                            Precio: $${Number(vehiculo.precio).toFixed(2)}
                        </p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="/automarketweb/views/vehicle_detail.php?id=${vehiculo.id_vehiculo}" class="btn btn-primary">Ver Detalle</a>
                    </div>
                </div>
            `;
            vehiclesContainer.appendChild(col);
        }
        displayedCount = end;
        updateButtons();
    }

    // Actualizar visibilidad de los botones "Mostrar más" y "Mostrar menos"
    function updateButtons() {
        if (displayedCount > 3 && !showLessBtn) {
            showLessBtn = document.createElement('button');
            showLessBtn.className = 'btn btn-secondary ms-2';
            showLessBtn.textContent = 'Mostrar menos';
            showLessBtn.addEventListener('click', function() {
                resetVehicles();
            });
            showMoreBtn.parentNode.insertBefore(showLessBtn, showMoreBtn.nextSibling);
        }
        if (displayedCount === 3 && showLessBtn) {
            showLessBtn.remove();
            showLessBtn = null;
        }
        showMoreBtn.style.display = displayedCount >= vehicles.length ? 'none' : 'inline-block';
    }

    // Reiniciar vista para mostrar solo los 3 primeros vehículos
    function resetVehicles() {
        vehiclesContainer.innerHTML = "";
        displayedCount = 0;
        displayVehicles(3);
    }

    showMoreBtn.addEventListener('click', function() {
        displayVehicles(6);
    });

    // Renderizar inicialmente 3 vehículos
    displayVehicles(3);
});
