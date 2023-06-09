const Router = require('express').Router();
const OrderController = require('../../app/controllers/controller.order');

Router.get('/', OrderController.index);
Router.get('/delete/:id', OrderController.destroy);
Router.get('/update/:id', OrderController.update);
Router.get('/updateNext/:id', OrderController.updateNext);

module.exports = Router;
