const express = require('express');
const usuariosController = require('./controllers/vehiculosController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(usuariosController);


app.listen(4002, () => {
  console.log('Microservicio "Vehiculos" ejecutándose en el puerto 4002');
});