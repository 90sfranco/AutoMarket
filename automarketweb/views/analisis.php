<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AUTOMARKET-DASHBOARD</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    :root {
      --bg-color: #f8f9fa;
      --card-color: #ffffff;
      --text-color: #000;
      --header-bg: #0d1b2a;
    }

    body.dark-mode {
      --bg-color: #1a1a2e;
      --card-color: #2d2d44;
      --text-color: #f8f9fa;
      --header-bg: #16213e;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
    }

    .navbar-custom {
      background-color: var(--header-bg);
    }

    .navbar-brand {
      color: #fff;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .card {
      background-color: var(--card-color);
      color: var(--text-color);
      border: none;
      border-radius: 12px;
    }

    .card-header {
      font-weight: bold;
      border-bottom: none;
    }

    .toggle-switch {
      position: absolute;
      right: 20px;
      top: 16px;
    }

    canvas {
      max-height: 280px;
    }
  </style>
</head>
<body>

  <!-- Navbar con botón de modo oscuro -->
  <nav class="navbar navbar-custom py-3 position-relative">
    <div class="container-fluid">
      <span class="navbar-brand mx-auto">AUTOMARKET-DASHBOARD</span>
      <button class="btn btn-outline-light toggle-switch" onclick="toggleDarkMode()">🌙</button>
    </div>
  </nav>

  <!-- Contenedor principal de las gráficas -->
  <div class="container py-4">
    <div class="row g-4">
      <!-- Gráfica: Vehículos por Marca -->
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">Vehículos por Marca</div>
          <div class="card-body"><canvas id="graficoMarca"></canvas></div>
        </div>
      </div>

      <!-- Gráfica: Vehículos por Año -->
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-info text-white">Vehículos por Año</div>
          <div class="card-body"><canvas id="graficoAnio"></canvas></div>
        </div>
      </div>

      <!-- Gráfica: Tipo de Carrocería -->
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-secondary text-white">Tipo de Carrocería</div>
          <div class="card-body"><canvas id="graficoCarroceria"></canvas></div>
        </div>
      </div>

      <!-- Gráfica: Tipo de Transmisión -->
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-dark text-white">Tipo de Transmisión</div>
          <div class="card-body"><canvas id="graficoTransmision"></canvas></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // ---------- VARIABLES GLOBALES ----------

    let darkMode = false;

    // 1) Guardamos en el cliente (navegador) un diccionario de vehículos actuales,
    //    indexados por id_vehiculo, para saber a qué registros corresponde cada operación.
    const vehiclesMap = {}; // ej: { "18": { id_vehiculo:18, marca:"Chevrolet", ... }, "23": {...} }

    // 2) Contadores que mantendrán la cantidad de cada atributo en las gráficas.
    //    Cuando un vehículo se inserte u actualice, sumamos (+1) a su valor; si se borra, restamos (-1).
    const counters = {
      marca: {},
      anio: {},
      tipo_carroceria: {},
      transmision: {}
    };

    // 3) Configuración base para cada gráfica (Chart.js)
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
          maintainAspectRatio: false
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
          maintainAspectRatio: false
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
      graficoTransmision: {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: "Cantidad",
            data: [],
            backgroundColor: ['#343a40', '#adb5bd']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    };

    // Instancias de Chart.js que luego vamos a usar para destruir/crear
    const charts = {};

    // ---------- FUNCIONES AUXILIARES PARA MANEJAR CONTADORES ----------

    /**
     * updateCounters(valor, clave, delta):
     *   - valor: ej. "Chevrolet", 2022, "SWD", "Automática"...
     *   - clave: "marca" | "anio" | "tipo_carroceria" | "transmision"
     *   - delta: +1 para sumar, -1 para restar.
     *
     * Si el contador llega a 0 o menos, borramos la propiedad.
     */
    function updateCounters(valor, clave, delta) {
      if (valor === undefined || valor === null) return;
      // Si no existía esa clave aún, la inicializamos
      if (!counters[clave][valor]) {
        counters[clave][valor] = 0;
      }
      counters[clave][valor] += delta;
      // Si se queda en 0 o menos, la quitamos
      if (counters[clave][valor] <= 0) {
        delete counters[clave][valor];
      }
    }

    /**
     * Reconstruye los datos de todas las gráficas a partir de los counters actuales
     * y vuelve a dibujarlas.
     */
    function renderCharts() {
      // 1) Marca
      chartConfigs.graficoMarca.data.labels = Object.keys(counters.marca);
      chartConfigs.graficoMarca.data.datasets[0].data = Object.values(counters.marca);

      // 2) Año (conjunto ordenado)
      const anios = Object.keys(counters.anio).sort();
      chartConfigs.graficoAnio.data.labels = anios;
      chartConfigs.graficoAnio.data.datasets[0].data = anios.map(a => counters.anio[a]);

      // 3) Tipo de carrocería
      chartConfigs.graficoCarroceria.data.labels = Object.keys(counters.tipo_carroceria);
      chartConfigs.graficoCarroceria.data.datasets[0].data = Object.values(counters.tipo_carroceria);

      // 4) Transmisión
      chartConfigs.graficoTransmision.data.labels = Object.keys(counters.transmision);
      chartConfigs.graficoTransmision.data.datasets[0].data = Object.values(counters.transmision);

      // Finalmente, destruyo y vuelvo a crear cada chart
      for (let id in chartConfigs) {
        const ctx = document.getElementById(id).getContext('2d');
        if (charts[id]) {
          charts[id].destroy();
        }
        charts[id] = new Chart(ctx, chartConfigs[id]);
      }
    }

    /**
     * addVehicle(v):
     *   - Si el ID ya existía, lo estamos sobre-escribiendo: por seguridad, primero restamos
     *     los contadores del "viejo" y luego sumamos los del "nuevo".
     *   - Si es un ID nuevo, simplemente sumamos sus contadores.
     */
    function addVehicle(v) {
      const id = v.id_vehiculo;
      // Si ya existe, primero removemos la versión anterior
      if (vehiclesMap[id]) {
        const prev = vehiclesMap[id];
        // restamos contadores de prev
        updateCounters(prev.marca, "marca", -1);
        updateCounters(prev.anio, "anio", -1);
        updateCounters(prev.tipo_carroceria, "tipo_carroceria", -1);
        updateCounters(prev.transmision, "transmision", -1);
      }
      // Ahora guardamos el nuevo
      vehiclesMap[id] = v;
      // Y sumamos sus contadores
      updateCounters(v.marca, "marca", +1);
      updateCounters(v.anio, "anio", +1);
      updateCounters(v.tipo_carroceria, "tipo_carroceria", +1);
      updateCounters(v.transmision, "transmision", +1);

      renderCharts();
    }

    /**
     * removeVehicle(v):
     *   - Si v existe en vehiclesMap (o vino por delete), restamos sus contadores
     *     y lo borramos del mapa.
     */
    function removeVehicle(v) {
      if (!v) return;
      const id = v.id_vehiculo;
      if (!vehiclesMap[id]) {
        return; // ya no estaba, nada que hacer
      }
      // Restamos contadores
      updateCounters(v.marca, "marca", -1);
      updateCounters(v.anio, "anio", -1);
      updateCounters(v.tipo_carroceria, "tipo_carroceria", -1);
      updateCounters(v.transmision, "transmision", -1);
      // Lo quitamos del mapa
      delete vehiclesMap[id];
      renderCharts();
    }

    // ---------- MODO OSCURO ----------

    function toggleDarkMode() {
      darkMode = !darkMode;
      document.body.classList.toggle("dark-mode", darkMode);
      renderCharts();
    }

    // ---------- CONFIGURACIÓN DEL WEBSOCKET ----------

    // Ajusta aquí la URL de tu WebSocket:
    // - Si pruebas en local: ws://localhost:9000/vehiculos
    // - Si estás en Docker y tu host es kafka-streams: ws://kafka-streams:9000/vehiculos
    const WS_URL = "ws://localhost:9000/vehiculos";

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
        console.warn("⚠️ Conexión WebSocket cerrada. Intentando reconectar en 5s...", ev.reason);
        setTimeout(() => iniciarWebSocket(), 5000);
      };

      socket.onmessage = function(event) {
        // Filtrar mensajes vacíos
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

        // Ahora esperamos que el backend haya mandado:
        // { "op": "c"|"u"|"d"|"r", "data": { ...campos del vehículo... } }
        const op = parsed.op;
        const v = parsed.data;
        if (!op || !v) {
          console.warn("⚠️ Mensaje sin op o data:", parsed);
          return;
        }

        // Dependiendo de la operación, llamamos a la función correspondiente:
        if (op === "c" || op === "r") {
          // "c" = create (insert), "r" = snapshot inicial de Debezium
          addVehicle(v);
        }
        else if (op === "u") {
          // "u" = update: elimina contadores del antiguo y suma del nuevo
          addVehicle(v);
        }
        else if (op === "d") {
          // "d" = delete: quitamos contadores de ese vehículo
          removeVehicle(v);
        }
        else {
          console.warn("⚠️ Operación no reconocida:", op);
        }
      };
    }

    // ---------- INICIO AL CARGAR LA PÁGINA ----------

    window.addEventListener("load", () => {
      // 1) Inicialmente dibujo las gráficas vacías
      renderCharts();
      // 2) Abro el WebSocket para recibir datos
      iniciarWebSocket();
    });
  </script>

</body>
</html>
