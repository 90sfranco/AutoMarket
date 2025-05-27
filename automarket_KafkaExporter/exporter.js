const express = require('express');
const { Kafka } = require('kafkajs');
const client = require('prom-client');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// 🚗 Conteo total de vehículos modificados
const vehiculoCounter = new client.Counter({
  name: 'vehiculos_modificados_total',
  help: 'Cantidad total de vehículos modificados',
});
register.registerMetric(vehiculoCounter);

// Conteo por tipo de evento (creación, actualización, eliminación)
const tipoEventoCounter = new client.Counter({
  name: 'eventos_kafka_total',
  help: 'Cantidad total de eventos Kafka por tipo',
  labelNames: ['tipo'],
});
register.registerMetric(tipoEventoCounter);

// Histograma de latencia entre mensajes
const latenciaMensajes = new client.Histogram({
  name: 'latencia_entre_mensajes_segundos',
  help: 'Tiempo entre recepción de mensajes Kafka en segundos',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});
register.registerMetric(latenciaMensajes);

// Tamaño de mensaje
const tamanoMensaje = new client.Summary({
  name: 'tamano_mensaje_bytes',
  help: 'Tamaño de los mensajes recibidos desde Kafka en bytes',
});
register.registerMetric(tamanoMensaje);

const kafka = new Kafka({
  brokers: ['kafka:29092'],
  clientId: 'metrics-exporter',
});

const consumer = kafka.consumer({ groupId: 'kafka-metrics' });

let ultimoMensaje = Date.now();

const start = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: 'vehiculosprefix.vehiculosdbauto_write.vehiculo',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const ahora = Date.now();
        const diferencia = (ahora - ultimoMensaje) / 1000;
        latenciaMensajes.observe(diferencia);
        ultimoMensaje = ahora;

        const rawValue = message.value;
        const size = rawValue ? Buffer.byteLength(rawValue) : 0;
        tamanoMensaje.observe(size);

        // Siempre contar el mensaje como actividad
        vehiculoCounter.inc();

        // Detectar tipo de evento
        let tipo = 'desconocido';
        if (rawValue) {
          try {
            const parsed = JSON.parse(rawValue.toString());
            if (parsed.payload?.after === null) tipo = 'Eliminación';
            else if (parsed.payload?.before) tipo = 'Actualización';
            else tipo = 'Creación';
          } catch (err) {
            console.warn('No se pudo parsear el mensaje JSON:', err.message);
          }
        } else {
          tipo = 'Eliminación'; // valor nulo = tombstone
        }

        tipoEventoCounter.inc({ tipo });
      } catch (err) {
        console.error('Error procesando mensaje Kafka:', err.message);
      }
    },
  });
};

start().catch(console.error);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('Exporter listo en http://localhost:3000/metrics');
});
