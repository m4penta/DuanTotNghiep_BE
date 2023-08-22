const Router = require('express').Router();
const ReplyCommentController = require('../../app/controllers/controller.replyComment');

Router.get('/getreply', ReplyCommentController.getComments);
Router.delete('/deleteReply/:id', ReplyCommentController.delete)// xóa bình luận phản hồi

module.exports = Router;
