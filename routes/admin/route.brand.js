const express = require('express');
const brandController = require('../../app/controllers/controller.brand');
const router = express.Router();
const { uploadS3 } = require('../../middlewares/upload-aws-s3');

router.get('/list', brandController.adminGetList);
router.get('/delete/:id', brandController.adminDeleteOne);
router.get('/edit', brandController.adminGetUpdate);
router.get('/add', brandController.adminGetAdd);
router.post(
  '/add',
  uploadS3.fields([{ name: 'brand', maxCount: 1 }]),
  brandController.adminPostAdd
);
router.post('/edit', brandController.adminPostUpdate);

module.exports = router;
