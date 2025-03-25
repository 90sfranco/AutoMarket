const express = require('express');
const cors = require('cors'); // Importar CORS
const usuariosController = require('./controllers/usuariosController');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Configurar CORS antes de definir las rutas
app.use(cors({
  origin: '*', // Permitir todas las conexiones (ajustar si es necesario)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(usuariosController);

app.listen(4001, () => {
  console.log('Microservicio Usuarios ejecutándose en el puerto 4001');
});
