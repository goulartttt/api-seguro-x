const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coberturasSchema = new Schema({
    nome: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true }
});

module.exports = mongoose.model('Cobertura', coberturasSchema);
