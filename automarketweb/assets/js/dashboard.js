// dashboard.js

// ---------- VARIABLES GLOBALES ----------

// Diccionario de vehículos actuales (id_vehiculo → objeto completo)
const vehiclesMap = {};

// Contadores que mantendrán la cantidad de cada atributo en las gráficas
const counters = {
  marca: {},
  anio: {},
  tipo_carroceria: {},
  tipo_combustible: {}
};

// Configuración base de Chart.js para cada gráfico
const chartConfigs = {
  graficoMarca: {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: "Cantidad",
        data: [],
        backgroundColor: '#007bff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              // Mostrar solo números enteros
              if (Number.isInteger(value)) {
                return value;
              }
            },
            stepSize: 1
          }
        }
      }
    }
  },
  graficoAnio: {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Cantidad",
        data: [],
        borderColor: '#17a2b8',
        backgroundColor: '#17a2b8',
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              // Mostrar solo números enteros
              if (Number.isInteger(value)) {
                return value;
              }
            },
            stepSize: 1
          }
        }
      }
    }
  },
  graficoCarroceria: {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#6c757d', '#007bff', '#198754', '#ffc107']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  },
  graficoTipoCombustible: {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#6c757d', '#007bff', '#198754', '#ffc107'] // ajusta colores a tu gusto
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }
};

// Instancias de Chart.js
const charts = {};

// ---------- FUNCIONES AUXILIARES PARA CONTADORES ----------

/**
 * updateCounters(valor, clave, delta):
 *   - valor: ej. "Chevrolet", 2022, "SWD"
 *   - clave: "marca" | "anio" | "tipo_carroceria"
 *   - delta: +1 para sumar, -1 para restar.
 * Si el contador llega a 0 o menos, borramos la propiedad.
 */
function updateCounters(valor, clave, delta) {
  if (valor === undefined || valor === null) return;
  if (!counters[clave][valor]) {
    counters[clave][valor] = 0;
  }
  counters[clave][valor] += delta;
  if (counters[clave][valor] <= 0) {
    delete counters[clave][valor];
  }
}

/**
 * renderCharts():
 *   Reconstruye los datos de todos los charts según los counters actuales
 *   y los redibuja. Después actualiza las tarjeticas de conteo.
 */
function renderCharts() {
  // --- Gráfico de Marca ---
  chartConfigs.graficoMarca.data.labels = Object.keys(counters.marca);
  chartConfigs.graficoMarca.data.datasets[0].data = Object.values(counters.marca);

  // --- Gráfico de Año (ordenado) ---
  const anios = Object.keys(counters.anio).sort();
  chartConfigs.graficoAnio.data.labels = anios;
  chartConfigs.graficoAnio.data.datasets[0].data = anios.map(a => counters.anio[a]);

  // --- Gráfico de Carrocería ---
  chartConfigs.graficoCarroceria.data.labels = Object.keys(counters.tipo_carroceria);
  chartConfigs.graficoCarroceria.data.datasets[0].data = Object.values(counters.tipo_carroceria);

  // --- Gráfico de Tipo de Combustible ---
  chartConfigs.graficoTipoCombustible.data.labels = Object.keys(counters.tipo_combustible);
  chartConfigs.graficoTipoCombustible.data.datasets[0].data = Object.values(counters.tipo_combustible);

  // Destruyo y vuelvo a crear cada chart
  for (let id in chartConfigs) {
    const ctx = document.getElementById(id).getContext('2d');
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(ctx, chartConfigs[id]);
  }

  // Luego de redibujar gráficas, actualizo las tarjeticas
  updateStatCards();
}

/**
 * addVehicle(v):
 *   - Si el ID ya existía, primero restamos contadores del “viejo”.
 *   - Luego guardamos “nuevo” en vehiclesMap y sumamos sus contadores.
 */
function addVehicle(v) {
  const id = v.id_vehiculo;

  // Si ya existe en el mapa, restamos los valores antiguos
  if (vehiclesMap[id]) {
    const prev = vehiclesMap[id];
    updateCounters(prev.marca, "marca", -1);
    updateCounters(prev.anio, "anio", -1);
    updateCounters(prev.tipo_carroceria, "tipo_carroceria", -1);
    updateCounters(prev.tipo_combustible,  "tipo_combustible",  -1);
  }

  // Guardamos la nueva versión
  vehiclesMap[id] = v;

  // Sumamos contadores de la versión actual
  updateCounters(v.marca, "marca", +1);
  updateCounters(v.anio, "anio", +1);
  updateCounters(v.tipo_carroceria, "tipo_carroceria", +1);
  updateCounters(v.tipo_combustible, "tipo_combustible",  +1);

  renderCharts();
}

/**
 * removeVehicle(v):
 *   - Si existe en vehiclesMap, restamos sus contadores y lo eliminamos.
 */
function removeVehicle(v) {
  if (!v) return;
  const id = v.id_vehiculo;
  if (!vehiclesMap[id]) return;

  // Restamos contadores
  updateCounters(v.marca, "marca", -1);
  updateCounters(v.anio, "anio", -1);
  updateCounters(v.tipo_carroceria, "tipo_carroceria", -1);
  updateCounters(v.tipo_combustible,    "tipo_combustible",  -1);

  // Eliminamos del mapa
  delete vehiclesMap[id];

  renderCharts();
}

// ---------- FUNCIONES PARA LAS TARJETICAS DE CONTEO ----------

/**
 * updateStatCards():
 *   Llama a esta función cada vez que renderCharts() haya terminado de dibujar.
 *   Rellena las tarjeticas de conteo:
 *     - Total de Vehículos
 *     - Total de Marcas Distintas
 *     - Total de Años Distintos
 *     - Total de Tipos de Carrocería Distintos
 */
function updateStatCards() {
  // 1) Total de Vehículos
  const totalVehiculos = Object.keys(vehiclesMap).length;
  document.getElementById("stat-total-vehiculos").textContent = totalVehiculos;

  // 2) Total de Marcas Distintas
  const totalMarcas = Object.keys(counters.marca).length;
  document.getElementById("stat-total-marcas").textContent = totalMarcas;

  // 3) Total de Años Distintos
  const totalAnios = Object.keys(counters.anio).length;
  document.getElementById("stat-total-anios").textContent = totalAnios;

  // 4) Total de Tipos de Carrocería Distintos
  const totalCarrocerias = Object.keys(counters.tipo_carroceria).length;
  document.getElementById("stat-total-carrocerias").textContent = totalCarrocerias;
}

// ---------- MODO OSCURO ----------

let darkMode = false;
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
  renderCharts(); // Redibuja los charts con el nuevo tema
}

// ---------- HISTÓRICO INICIAL (inyectado por PHP) ----------
// El HTML de analysis.php inyecta al principio:
//    <script> const initialVehicles = […]; </script>
// Este arreglo contiene todos los vehículos del rango filtrado por MongoDB.

/**
 * Configuración del WebSocket para recibir datos en vivo
 */
const WS_URL = "ws://localhost:9000/vehiculos";
// Si tu entorno Docker expone kafka-streams así, reemplaza por:
// const WS_URL = "ws://kafka-streams:9000/vehiculos";

let socket;
function iniciarWebSocket() {
  try {
    socket = new WebSocket(WS_URL);
  } catch (err) {
    console.error("❌ No se pudo crear el WebSocket:", err);
    return;
  }

  socket.onopen = () => {
    console.log("✅ Conectado al WebSocket en:", WS_URL);
  };

  socket.onerror = (err) => {
    console.error("❌ Error en WebSocket:", err);
  };

  socket.onclose = (ev) => {
    console.warn("⚠️ Conexión WebSocket cerrada. Reconectando en 5s…", ev.reason);
    setTimeout(() => iniciarWebSocket(), 5000);
  };

  socket.onmessage = function(event) {
    if (!event.data || event.data === "null") {
      console.warn("⚠️ Mensaje nulo recibido, se ignora.");
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(event.data);
    } catch (e) {
      console.error("❌ No es JSON válido:", event.data);
      return;
    }
    // Debería venir un objeto { op: "c"|"u"|"d"|"r", data: { … } }
    const op = parsed.op;
    const v = parsed.data;
    if (!op || !v) {
      console.warn("⚠️ Mensaje sin op o data:", parsed);
      return;
    }
    if (op === "c" || op === "r") {
      // Create o snapshot inicial
      addVehicle(v);
    }
    else if (op === "u") {
      // Update
      addVehicle(v);
    }
    else if (op === "d") {
      // Delete
      removeVehicle(v);
    }
    else {
      console.warn("⚠️ Operación no reconocida del WebSocket:", op);
    }
  };
}

// ---------- INICIO AL CARGAR LA PÁGINA ----------

window.addEventListener("load", () => {
  // 1) Dibujo las gráficas vacías (para que no salgan errores si no hay datos aún)
  renderCharts();

  // 2) Cargo el snapshot inicial venido de PHP/Mongo
  initialVehicles.forEach(v => {
    addVehicle(v);
  });

  // 3) Finalmente, abro el WebSocket para los cambios en vivo
  iniciarWebSocket();
});
