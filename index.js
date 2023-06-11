/** @format */

import express from 'express';
import cors from 'cors';
require('dotenv').config();
const initRoutes = require('./src/routes');
require('./connection_database');

const app = express();
//Chỉ cho các method bên dưới được vào server
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

//CRUD
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Tựng động convest sang json

initRoutes(app);

const PORT = process.env.PORT || 8000;
const listener = app.listen(PORT, () => {
  console.log(
    'Server listening on port http//localhost:' + listener.address().port
  );
});
