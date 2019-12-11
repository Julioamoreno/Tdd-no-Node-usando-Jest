const routes = require('express').Router();

const authMiddleware = require('./app/middleware/auth');

const SessionController = require("./app/controllers/SessionController");

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.get('/dashboard', (req, res) => {
    return res.status(200).send();
})
//Definição de rotas

module.exports= routes;
