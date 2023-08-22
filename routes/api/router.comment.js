const Router = require('express').Router();
const CommentController = require('../../app/controllers/controller.comment');
const ReplyCommentController = require('../../app/controllers/controller.replyComment');

Router.get('/', CommentController.index);
Router.get('/getreply', ReplyCommentController.getComments);
Router.delete('/deleteReply/:id', ReplyCommentController.delete)// xóa bình luận phản hồi
Router.get('/:id', CommentController.detail);
Router.post('/add', CommentController.add);
Router.post('/reply', ReplyCommentController.addReply);
Router.delete('/delete/:id', CommentController.delete)


module.exports = Router;
