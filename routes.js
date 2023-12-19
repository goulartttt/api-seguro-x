const controllers = require('./controllers');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./config.js');

module.exports = (express) => {
    const route = express.Router();

    route.post('/users/cadastro', controllers.cadastro);
    route.post('/users/login', controllers.login);
    //Autenticar Rota
    route.use((req, res, next) => {
        try {
            const token = req.headers['token'];
  
            if (!token) {
              return res.status(401).json({ success: false, message: 'Token não fornecido.' });
            }
        
            jwt.verify(token, secretKey, (err, decoded) => {
              if (err) {
                console.log(err)
                return res.status(401).json({ success: false, message: 'Token inválido.' });
              } else {
                req.decoded = decoded;
                next();
              }
            });
          } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return res.status(500).json({ success: false, message: 'Erro interno ao verificar autenticação.' });
          }
    });

    route.post('/cotacao/cadastro', controllers.cadastrarCotacao);
    route.get('/verificar-autenticacao', controllers.verificarAutenticacao);
    route.get('/coberturas', controllers.coberturas);
    route.get('/obterDadosCotacao/:indice', controllers.obterDadosCotacao);
    route.get('/listaCotacao', controllers.listaCotacao);
    route.post('/salvarEdicao', controllers.editarCotacao);
    route.get('/proposta/:n_cotacao', controllers.criarProposta);
    route.post('/apolice', controllers.apolice);
    route.get('/listaApolice', controllers.listaApolice);
    route.get('/obterDadosApolice/:num_doc', controllers.obterDadosApolice);

    return route;
};
