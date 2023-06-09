const Router = require('express').Router();
const authController = require('../../app/controllers/controller.user');

Router.post('/login', authController.login);
Router.post('/register', authController.register);

module.exports = Router;
