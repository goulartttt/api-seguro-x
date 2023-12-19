// models/proposta.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propostaSchema = new Schema({
  n_proposta: { type: Number, unique: true },
  uid: { type: String, unique: true},
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  valorRisco: { type: Number, required: true, min: 5000, max: 1000000 },
  inicioVigencia: { type: String, required: true },
  fimVigencia: { type: String, required: true },
  coberturas: { type: Object, required: true },
  formas_pagamento: { type: Object, required: false },

});

module.exports = mongoose.model('Proposta', propostaSchema);
