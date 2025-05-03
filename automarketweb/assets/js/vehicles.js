document.addEventListener('DOMContentLoaded', function() {
    const vehiclesContainer = document.getElementById('vehiclesContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');
    let showLessBtn = null;
    let vehicles = vehiclesData || [];
    let displayedCount = 0;

    // Función segura para parsear fecha en formato "yyyy-mm-dd" como local
    function parseLocalDate(fechaStr) {
        const [anio, mes, dia] = fechaStr.split('-').map(Number);
        return new Date(anio, mes - 1, dia); // mes se indexa desde 0
    }

    // Función para formatear la fecha con badge según reglas
    function formatFecha(fechaStr) {
        const fecha = parseLocalDate(fechaStr);
        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);

        // Normalizamos las fechas sin hora
        const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const fechaNormal = normalize(fecha);
        const hoyNormal = normalize(hoy);
        const ayerNormal = normalize(ayer);

        if (fechaNormal.getTime() === hoyNormal.getTime()) {
            return `<span class="badge bg-success rounded-pill">Hoy</span>`;
        } else if (fechaNormal.getTime() === ayerNormal.getTime()) {
            return `<span class="badge bg-warning text-dark rounded-pill">Ayer</span>`;
        } else {
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const anio = fecha.getFullYear();
            return `${dia}/${mes}/${anio}`;
        }
    }

    // Renderiza vehículos
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
                            Precio: <span class="badge bg-success rounded-pill">$${Number(vehiculo.precio).toFixed(2)}</span><br>
                            Fecha de publicación: ${formatFecha(vehiculo.fechaCreacion)}<br>
                        </p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="../../views/vehicle_detail.php?id=${vehiculo.id_vehiculo}" class="btn btn-secondary">Ver Detalle</a>
                    </div>
                </div>
            `;
            vehiclesContainer.appendChild(col);
        }
        displayedCount = end;
        updateButtons();
    }

    function updateButtons() {
        if (displayedCount > 3 && !showLessBtn) {
            showLessBtn = document.createElement('button');
            showLessBtn.className = 'btn btn-secondary ms-2';
            showLessBtn.textContent = 'Mostrar menos';
            showLessBtn.addEventListener('click', resetVehicles);
            showMoreBtn.parentNode.insertBefore(showLessBtn, showMoreBtn.nextSibling);
        }
        if (displayedCount === 3 && showLessBtn) {
            showLessBtn.remove();
            showLessBtn = null;
        }
        showMoreBtn.style.display = displayedCount >= vehicles.length ? 'none' : 'inline-block';
    }

    function resetVehicles() {
        vehiclesContainer.innerHTML = "";
        displayedCount = 0;
        displayVehicles(3);
    }

    showMoreBtn.addEventListener('click', () => displayVehicles(6));

    displayVehicles(3);
});
