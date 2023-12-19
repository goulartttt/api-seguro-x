const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cotacaoSchema = new Schema({
    n_cotacao: { type: Number, unique: true },
    uid: { type: String, unique: true },
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    valorRisco: { type: Number, required: true, min: 5000, max: 1000000 },
    inicioVigencia: { type: String, required: true },
    fimVigencia: { type: String, required: true },
    coberturas: {type: Object, required: true}
});

module.exports = mongoose.model('Cotacao', cotacaoSchema);
