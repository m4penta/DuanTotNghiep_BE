const Router = require('express').Router();
const authController = require('../../app/controllers/controller.user');
const userController = require('../../app/controllers/controller.user');

Router.post('/login', authController.login);
Router.post('/register', authController.register);
//update user FE
Router.get('/user/:id/getuser', userController.userGetEdit);
Router.put('/user/:id/update', userController.updateUserById);
module.exports = Router;
