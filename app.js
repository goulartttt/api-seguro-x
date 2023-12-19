const { port, database } = require('./config.js');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes')(express);

const options = {
    autoIndex: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMs: 45000,
    family: 4,
    useNewUrlParser: true
};

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

mongoose.connect(database, options);

app.use(express.json());

app.use('/api', routes);

console.log(`Api rodando na porta: ${port}`);
app.listen(port);
