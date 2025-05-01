const express = require('express');
const queriesController = require('./controllers/queriesController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(queriesController);


app.listen(process.env.PORT || 4005, () => {
  console.log(`Microservicio "Vehiculos - Consultas" ejecutándose en el puerto ${process.env.PORT}`);
});