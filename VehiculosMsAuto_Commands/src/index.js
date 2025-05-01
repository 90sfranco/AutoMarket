const express = require('express');
const commandsController = require('./controllers/commandsController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(commandsController);


app.listen(process.env.PORT || 4006, () => {
  console.log(`Microservicio Usuarios ejecutándose en el puerto ${process.env.PORT}`);
});