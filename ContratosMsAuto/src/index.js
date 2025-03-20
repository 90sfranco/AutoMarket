const express = require('express');
const contratosController = require('./controllers/contratosController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(contratosController);


app.listen(4003, () => {
  console.log('Microservicio de contratos escuchando en el puerto 4003');
});