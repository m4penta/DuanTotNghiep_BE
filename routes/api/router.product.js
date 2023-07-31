const Router = require('express').Router();
const productController = require('../../app/controllers/controller.product');

Router.get('/product/filter', productController.apiFilter); // search product
Router.get('/product/search/:q', productController.apiSearch);
Router.get('/product', productController.apiGetList);
Router.get('/product/:id', productController.apiGetOne);
Router.get('/product/update-view/:id', productController.apiViewUpdate);

module.exports = Router;
