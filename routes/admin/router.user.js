const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/controller.user');

router.get('/list', userController.userGetList);
router.get('/authorize/:id', userController.userAuthorize);
router.get('/unauthorize/:id', userController.userUnAuthorize);

module.exports = router;
