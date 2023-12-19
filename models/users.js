const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    uid: { type: String, unique: true, required: true },
    nome: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    senha: { type: String, required: true }
});

module.exports = mongoose.model('User', usersSchema);
