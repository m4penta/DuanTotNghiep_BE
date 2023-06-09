const Router = require('express').Router();
const OrderController = require('../../app/controllers/controller.order');

Router.post('/', OrderController.store);

module.exports = Router;
