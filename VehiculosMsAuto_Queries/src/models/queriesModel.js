const { MongoClient, ObjectId } = require('mongodb');

// URI de conexión y configuración de la base de datos
const uri = 'mongodb://localhost:27017/'; // Conectar al servidor, la BD se especifica después
const dbName = 'VehiculosDBAuto_Read';
const collectionName = 'vehiculo';

let collection;

// Función para conectar a MongoDB y obtener la colección
async function connectDB() {
    if (collection) {
        return collection;
    }
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Conectado exitosamente a MongoDB");
        const db = client.db(dbName);
        collection = db.collection(collectionName);
        return collection;
    } catch (error) {
        console.error("No se pudo conectar a MongoDB", error);
        process.exit(1); // Salir si no se puede conectar a la BD
    }
}

// Inicializar la conexión al cargar el módulo
connectDB();

/**
 * Obtiene todos los vehículos
 */
async function getAllVehicles() {
    const vehiculoCollection = await connectDB();
    const result = await vehiculoCollection.find({}).toArray();
    console.log(`Total de vehiculos: ${result.length}`);
    return result;
}

/**
 * Obtiene todos los vehículos por usuario vendedor
 * Asumiendo que el ID de usuario se guarda como 'id_usuario' en MongoDB
 */
async function getVehiclesByUser(userId) {
    const vehiculoCollection = await connectDB();
    // Convertir userId a número si se almacena como número, o mantener como string si es string
    // Intentaremos convertir a número, si falla, lo usamos como string
    const numericUserId = parseInt(userId, 10);
    const queryValue = isNaN(numericUserId) ? userId : numericUserId;
    const query = { id_usuario: queryValue };
    const result = await vehiculoCollection.find(query).toArray();
    console.log(`Total de vehiculos para usuario ${userId}: ${result.length}`);
    return result;
}

/**
 * Obtiene vehículos filtrados según la marca y/o rango de precio.
 * Si no se envía alguno de los filtros, se omite esa condición.
 */
async function getFilteredVehicles(filters) {
    const vehiculoCollection = await connectDB();
    let query = { estado: 'disponible' }; // Filtrar siempre por disponibles

    if (filters.marca && filters.marca.trim() !== '') {
        // Búsqueda insensible a mayúsculas/minúsculas para la marca
        query.marca = { $regex: new RegExp(`^${filters.marca.trim()}$`, 'i') };
    }

    let priceQuery = {};
    const precioInicial = parseFloat(filters.precio_inicial);
    const precioFinal = parseFloat(filters.precio_final);

    if (!isNaN(precioInicial)) {
        priceQuery.$gte = precioInicial;
    }
    if (!isNaN(precioFinal)) {
        priceQuery.$lte = precioFinal;
    }

    if (Object.keys(priceQuery).length > 0) {
        query.precio = priceQuery;
    }

    console.log("Consulta filtrada MongoDB:", JSON.stringify(query));
    const result = await vehiculoCollection.find(query).toArray();
    return result;
}

/**
 * Obtiene un vehículo por su ID
 * Asumiendo que el ID se guarda como '_id' (ObjectId) o 'id_vehiculo'
 */
async function getVehicleById(id) {
    const vehiculoCollection = await connectDB();
    let vehicle = null;
    // Priorizar búsqueda por id_vehiculo (asumiendo que es el ID canónico de MySQL)
    // Intentar convertir a número, ya que probablemente sea un INT de MySQL
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
        vehicle = await vehiculoCollection.findOne({ id_vehiculo: numericId });
    }

    // Si no se encontró por id_vehiculo numérico O si el ID no era numérico,
    // intentar buscar por ObjectId (en caso de que se esté usando el _id de Mongo)
    if (!vehicle && ObjectId.isValid(id)) {
         vehicle = await vehiculoCollection.findOne({ _id: new ObjectId(id) });
    }

    // Si aún no se encuentra y el ID original no era numérico, buscar por id_vehiculo como string (menos probable)
    if (!vehicle && isNaN(numericId)) {
        vehicle = await vehiculoCollection.findOne({ id_vehiculo: id });
    }

    // Devolver array vacío si no se encuentra, o array con el vehículo si se encuentra
    // Asegurarse de que el objeto devuelto contenga id_vehiculo si se encontró por _id
    if (vehicle && !vehicle.id_vehiculo && vehicle._id) {
        // Esto es una contingencia, idealmente id_vehiculo siempre debería estar
        console.warn(`Vehículo encontrado por _id (${vehicle._id}) pero sin id_vehiculo.`);
        // Podríamos intentar asignar _id como id_vehiculo si es necesario temporalmente, pero no es ideal
        // vehicle.id_vehiculo = vehicle._id.toString();
    }

    return vehicle ? [vehicle] : [];
}

// Exporta las funciones para su uso en otros módulos
module.exports = {
    getAllVehicles,
    getVehicleById,
    getVehiclesByUser,
    getFilteredVehicles
};