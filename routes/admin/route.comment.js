const express = require('express');
const router = express.Router();
const commentController = require('../../app/controllers/controller.comment');
const replyCommentController = require('../../app/controllers/controller.replyComment');

router.get('/list', commentController.adminGetList);
router.get('/detail', commentController.adminGetDetail);
router.post('/reply', commentController.adminPostReply);

module.exports = router;
