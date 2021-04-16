const express = require('express');
const app = express()
const mongoose = require('mongoose');
const config = require('./config/config');

const url = config.bd_string;
const options = { poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true };


mongoose.connect(url, options);

mongoose.set('useCreateIndex', true);

mongoose.connection.on('error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + err);
})

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados!');
})

mongoose.connection.on('connected', () => {
    console.log("\n\n\nAplicação Conectada ao banco de dados!");
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users')
const tasksRoute = require('./routes/tasks');

app.use('/', indexRoute);
app.use('/tasks', tasksRoute);
app.use('/users', usersRoute);

app.listen(process.env.PORT, () => {
    console.log("Your server is running!")
})