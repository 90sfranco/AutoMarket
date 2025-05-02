const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'kafkaevents-processor',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] // Usar variable de entorno o default
});

const consumer = kafka.consumer({ groupId: 'vehiculos-group' });

// Configuración de MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // Usar variable de entorno o default
const client = new MongoClient(uri);

async function run() {
  try {
    // Conectar a MongoDB
    await client.connect();
    console.log("Conectado a MongoDB");

    const database = client.db("VehiculosDB_Read"); // Nombre de la base de datos de lectura
    const collection = database.collection("vehiculos"); // Nombre de la colección

    // Conectar a Kafka y suscribirse al tema de Debezium
    await consumer.connect();
    console.log("Conectado a Kafka");

    // Suscribirse al tema de Debezium para los cambios en la tabla vehiculo
    // El nombre del tema depende de la configuración de Debezium (server.name.database.table)
    await consumer.subscribe({ topic: process.env.DEBEZIUM_TOPIC || 'dbserver1.VehiculosDBAuto_Write.vehiculo', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
        
        // Procesar el mensaje de Debezium
        try {
          const event = JSON.parse(message.value.toString());
          // La estructura del evento de Debezium varía, necesitarás adaptarte a ella
          // Generalmente, los eventos de CRUD tienen una estructura con 'before' y 'after'
          // y un campo 'op' para indicar la operación (c, u, d, r)

          if (event.payload) {
            const payload = event.payload;
            const operation = payload.op; // c: create, u: update, d: delete, r: read (snapshot)
            const record = operation === 'd' ? payload.before : payload.after; // Datos del registro

            if (!record) {
                console.log("Registro nulo, omitiendo mensaje.");
                return;
            }

            const vehicleId = record.id_vehiculo; // Asume que el ID del vehículo es 'id_vehiculo'

            switch (operation) {
              case 'c': // Create
              case 'r': // Read (snapshot)
                // Insertar el nuevo vehículo en MongoDB
                await collection.insertOne({ _id: vehicleId, ...record });
                console.log(`Vehículo insertado/sincronizado en MongoDB con ID: ${vehicleId}`);
                break;
              case 'u': // Update
                // Actualizar el vehículo existente en MongoDB
                await collection.updateOne(
                  { _id: vehicleId },
                  { $set: record }
                );
                console.log(`Vehículo actualizado en MongoDB con ID: ${vehicleId}`);
                break;
              case 'd': // Delete
                // Eliminar el vehículo de MongoDB
                await collection.deleteOne({ _id: vehicleId });
                console.log(`Vehículo eliminado de MongoDB con ID: ${vehicleId}`);
                break;
            }
          }

        } catch (e) {
          console.error("Error procesando mensaje de Kafka:", e);
          // Dependiendo de la política de manejo de errores, podrías querer
          // mover este mensaje a un 'dead-letter topic'
        }
      },
    });

  } catch (error) {
    console.error("Error en el microservicio KafkaeventsMS:", error);
  }
}

run().catch(console.error);

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  console.log('\nDesconectando de Kafka y MongoDB...');
  await consumer.disconnect();
  await client.close();
  console.log('Desconectado. Saliendo.');
  process.exit(0);
});