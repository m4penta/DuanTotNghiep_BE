const Router = require('express').Router();
const OrderController = require('../../app/controllers/controller.order');

Router.post('/create', OrderController.createOrder);
Router.get('/allOrder', OrderController.getAllOrders);
Router.put('/update/:id', OrderController.updateOrderById);
Router.delete('/delete/:id', OrderController.deleteOrderById);
Router.get('/:id', OrderController.GetOderById);
module.exports = Router;
