const commentModel = require('../models/model.comment');
const productModel = require('../models/model.product');
const replyCommentModel = require('../models/model.replyComment');
const userModel = require('../models/model.user');

class CommentController {
  // [GET] get all comments
  index = async (req, res) => {
    try {
      const comment = await commentModel.find();
      res.status(200).json({ status: false, comment });
    } catch (error) {
      res.status(502).json({ status: false, error });
    }
  };

  detail = async (req, res) => {
    try {
      const { id: productId } = req.params;
      const productComment = await commentModel
        .find({ product: productId })
        .populate([
          { path: 'product', select: 'name' },
          { path: 'user', select: 'firstName lastName email image role' },
          {
            path: 'replyComment',
            populate: [
              {
                path: 'user',
              },
            ],
          },
        ]);
      res.status(200).json({ productComment });
    } catch (error) {
      res.status(502).json({ status: false, error });
    }
  };

  async add(req, res) {
    const { user, content, product } = req.body;

    try {
      const commentRes = await commentModel.create({
        user,
        content,
        product,
      });
      console.log(
        '🚀 ~ file: controller.comment.js ~ line 48 ~ CommentController ~ add ~ commentRes',
        commentRes
      );
      res.status(200).json(commentRes);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  async adminGetList(req, res) {
    try {
      const comments = await commentModel.find().populate([
        { path: 'product', select: 'name' },
        { path: 'user', select: 'firstName lastName email role image' },
      ]);
      console.log(comments);
      return res.status(200).render('template/comment/list', { comments });
      // return res.status(200).json(comments);
    } catch (error) {
      return res.status(300).rerender('/');
    }
  }

  async adminGetDetail(req, res) {
    try {
      const { id } = req.query;
      const comment = await commentModel.findOne({ _id: id }).populate([
        { path: 'product', select: 'name' },
        { path: 'user', select: 'firstName lastName email image role' },
        {
          path: 'replyComment',
          populate: [
            {
              path: 'user',
            },
          ],
        },
      ]);
      res
        .status(200)
        .render('template/comment/detail', { comment, message: '' });
    } catch (error) {
      res.status(300).rerender('/');
    }
  }
  async adminPostReply(req, res) {
    const { productId, content } = req.body;
    const { id } = req.query;

    try {
      const commentReply = new replyCommentModel({
        product: productId,
        content,
        user: req.user.user_id,
      });
      await replyCommentModel.create(commentReply);
      const comment = await commentModel.findOne({ _id: id });
      comment.replyComment.push(commentReply._id);
      await commentModel.updateOne({ _id: id }, comment);
      return res.status(200).redirect('/comment-manager/detail?id=' + id);
    } catch (error) {
      return res.status(400).redirect('/comment-manager/list');
    }
  }
}

module.exports = new CommentController();
