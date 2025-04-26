const express = require('express');
const commandsController = require('./controllers/commandsController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(commandsController);


app.listen(4005, () => {
  console.log('Microservicio "Vehiculos - Comandos" ejecutándose en el puerto 4005');
});