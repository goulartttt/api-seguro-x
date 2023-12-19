const uuid = require('uuid');
const {geraNumDoc} = require('./utils.js')
const usersModel = require('./models/users.js');
const cotacaoModel = require('./models/cotacao');
const coberturasModel = require('./models/coberturas');
const propostaModel = require('./models/proposta.js');
const apoliceModel = require('./models/apolice.js');
const { secretKey } = require('./config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const controllers = {
    cadastro: async (req, res) => {
        try {
            const usernameInserido = req.body.username
            const senhaInserida = req.body.senha;

            const salt = await bcrypt.genSalt(12);
            const password = await bcrypt.hash(senhaInserida, salt);

            const cadastro = new usersModel({
                uid: uuid.v4(), 
                nome: req.body.nome,
                username: req.body.username,
                senha: password
            });

            const contaJaExiste = await usersModel.findOne({ username: usernameInserido }); 

            if (contaJaExiste) {
              return res.status(200).json({ success: false, msg: 'Essa conta já existe.' });
            }
            
            await cadastro.save();

            res.json({ success: true, msg: "Cadastro realizado com sucesso", cadastro: cadastro });
        } catch (error) {
            res.status(401).json({ success: false, msg: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const senhaDigitada = req.body.senha;
            const usernameDigitado = req.body.username;

            const usernameUsuario = await usersModel.findOne({ username: usernameDigitado });

            if (!usernameUsuario) {
                return res.status(404).json({ success: false, msg: "Nome de usuário não encontrado." });
            }

            const checkPassword = await bcrypt.compare(senhaDigitada, usernameUsuario.senha);

            if (!checkPassword) {
                return res.status(401).json({ success: false, msg: "Senha incorreta, verifique." });
            }


            const mostraUsuario = {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                uid: usernameUsuario.uid,
                nome: usernameUsuario.nome,
                username: usernameUsuario.username
            };

            const token = jwt.sign({ mostraUsuario }, secretKey, {expiresIn: 99999});

            res.json({ success: true, msg: "Usuário Logado", token, mostraUsuario });
        } catch (error) {
            console.error('Erro no login:', error.message);
            res.status(500).json({ success: false, msg: "Erro interno do servidor" });
        }
    },
    verificarAutenticacao: (req, res) => {
        try {
          const token = req.headers['token'];

          if (!token) {
            return res.status(401).json({ success: false, message: 'Token não fornecido.' });
          }
      
          jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
              return res.status(401).json({ success: false, message: 'Token inválido.' });
            } else {
              return res.json({ success: true, message: 'Usuário autenticado.' });
            }
          });
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          return res.status(500).json({ success: false, message: 'Erro interno ao verificar autenticação.' });
        }
      },
    coberturas:async (req, res) =>{
        try {
            const coberturas = await coberturasModel.find({})
            res.json({success: true, coberturas:coberturas})
        } catch (error) {
            res.status(400).json({success: false, msg: error})
        }    
    },
    cadastrarCotacao: async (req, res) => {
      try {
        const numeroCotacao = await cotacaoModel.countDocuments() + 1;

        const cotacao = new cotacaoModel({
          ...req.body,
          uid: req.decoded.mostraUsuario.uid,
          n_cotacao: numeroCotacao,
        });

        const cpf = req.body.cpf;

        const cotacaoCpf = await cotacaoModel.findOne({ cpf });

        if (cotacaoCpf) {
          return res.status(400).json({ error: 'Já existe uma cotação para este CPF.' });
        }

        await cotacao.save();

        res.json({ success: true, msg: "Cotação salva com sucesso", cotacao: cotacao });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, msg: "Erro ao salvar cotação" });
      }
    },
    obterDadosCotacao: async (req, res) => {
      try {
        const dadosCotacao = await cotacaoModel.findOne({n_cotacao: req.params.indice});
    
        if (!dadosCotacao) {
          return res.status(404).json({ success: false, msg: 'Dados da cotação não encontrados.' });
        }
    
        res.json({ success: true, dadosCotacao });
      } catch (error) {
        console.error('Erro ao obter dados da cotação:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao obter dados da cotação' });
      }
    },
    listaCotacao: async (req, res) => {
      try {
        const dadosCotacao = await cotacaoModel.find({uid: req.decoded.mostraUsuario.uid}).lean();
    
        if (!dadosCotacao) {
          return res.status(404).json({ success: false, msg: 'Dados da cotação não encontrados.' });
        }

        for (const [idx, cotacao] of Object.entries(dadosCotacao)) {
          const apoliceEfetivada = await apoliceModel.findOne({n_proposta: cotacao.n_cotacao}, 'n_proposta').lean();
          dadosCotacao[idx].efetivada = apoliceEfetivada ? true : false;
        }
    
        res.json({ success: true, dadosCotacao });  
      } catch (error) {
        console.error('Erro ao obter dados da cotação:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao obter dados da cotação' });
      }
    },
    editarCotacao: async (req, res) => {
      try {
        const cpf = req.body.cpf;

        const cotacaoCpf = await cotacaoModel.findOne({ cpf, n_cotacao:{$ne:req.body.n_cotacao} });

        if (cotacaoCpf) {
          return res.status(400).json({ error: 'Já existe uma cotação para este CPF.' });
        }


        await cotacaoModel.findOneAndUpdate({n_cotacao: req.body.n_cotacao}, req.body, {});

        res.json({ success: true, msg: "Cotação editada com sucesso" });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, msg: "Erro ao editar cotação" });
      }
    },
    criarProposta: async (req, res) => {
      try {
        const n_cotacao = req.params.n_cotacao;

        const dadosCotacao  = await cotacaoModel.findOne({n_cotacao: n_cotacao}).lean();

        delete dadosCotacao._id;

        const isProposta = await propostaModel.findOne({n_proposta: n_cotacao}).lean()

        if(!isProposta){
          const proposta = new propostaModel({
            ...dadosCotacao,
            n_proposta: n_cotacao
          });
  
          await proposta.save();
          
          res.json({ success: true, msg: 'Proposta criada com sucesso', proposta: proposta });
        }else{
          res.json({ success: true, msg: 'Proposta criada com sucesso', proposta: isProposta });
        }
        
      } catch (error) {
        console.error('Erro ao criar proposta:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao criar proposta' });
      }
    },
    apolice: async (req, res) => {
      try {
        const {n_proposta, formas_pagamento} = req.body;

        const dadosProposta  = await propostaModel.findOne({n_proposta: n_proposta});

       dadosProposta.formas_pagamento = formas_pagamento;
       
       await dadosProposta.save()

        delete dadosProposta._id;

        const apoliceHash = geraNumDoc(n_proposta)

        const apolice = new apoliceModel({
          ...dadosProposta.toObject(),
          formas_pagamento,
          num_doc: apoliceHash
        });

        await apolice.save();
        
        res.json({ success: true, msg: 'Apolice criada com sucesso', apolice: apolice });

      } catch (error) {
        console.error('Erro ao obter dados da apolice:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao obter dados da apolice' });
      }
    },
    listaApolice: async (req, res) => {
      try {
        const dadosApolice = await apoliceModel.find({uid: req.decoded.mostraUsuario.uid}).lean();
    
        if (!dadosApolice) {
          return res.status(404).json({ success: false, msg: 'Dados da apolice não encontrados.' });
        }
        res.json({ success: true, dadosApolice });  
      } catch (error) {
        console.error('Erro ao obter dados da apolice:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao obter dados da apolice' });
      }
    },
    obterDadosApolice: async (req, res) => {
      try {
        const {num_doc} = req.params;

        const dadosApolice = await apoliceModel.findOne({num_doc: num_doc});
    
        if (!dadosApolice) {
          return res.status(404).json({ success: false, msg: 'Dados da apolice não encontrados.' });
        }
    
        res.json({ success: true, dadosApolice });
      } catch (error) {
        console.error('Erro ao obter dados da apolice:', error.message);
        res.status(500).json({ success: false, msg: 'Erro interno ao obter dados da apolice' });
      }
    }
};

module.exports = controllers;
