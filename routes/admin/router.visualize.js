const express = require('express');
const router = express.Router();
const visualizeController = require('../../app/controllers/controller.visualize');

router.get('/', visualizeController.index);

module.exports = router;
