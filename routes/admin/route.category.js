const express = require('express');
const categoryController = require('../../app/controllers/controller.category');
const router = express.Router();

router.get('/list', categoryController.adminGetList);
router.get('/delete/:id', categoryController.adminDeleteOne);
router.get('/edit', categoryController.adminGetUpdate);
router.get('/add', categoryController.adminGetAdd);
router.post('/add', categoryController.adminPostAdd);
router.post('/edit', categoryController.adminPostUpdate);

module.exports = router;
