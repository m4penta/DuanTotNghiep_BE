const Router = require('express').Router();
const OrderController = require('../../app/controllers/controller.order');

Router.post('/create', OrderController.createOrder);
Router.get('/allOrder', OrderController.getAllOrders)
module.exports = Router;
