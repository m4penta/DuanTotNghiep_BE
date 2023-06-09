const Router = require('express').Router();
const categoryController = require('../../app/controllers/controller.category');

Router.get('/', categoryController.index);
Router.get('/:id', categoryController.detail);

module.exports = Router;
