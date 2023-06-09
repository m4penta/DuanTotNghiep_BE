const Router = require('express').Router();
const CommentController = require('../../app/controllers/controller.comment');
const ReplyCommentController = require('../../app/controllers/controller.replyComment');

Router.get('/', CommentController.index);
Router.get('/:id', CommentController.detail);
Router.post('/add', CommentController.add);
Router.post('/reply', ReplyCommentController.add);

module.exports = Router;
