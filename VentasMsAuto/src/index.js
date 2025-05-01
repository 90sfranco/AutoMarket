const express = require('express');
const ventasController = require('./controllers/ventasController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(ventasController);

app.listen(process.env.PORT || 4004, () => {
  console.log(`Microservicio de contratos escuchando en el puerto ${process.env.PORT}`);
});