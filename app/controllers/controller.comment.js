const commentModel = require('../models/model.comment');
const productModel = require('../models/model.product');
const replyCommentModel = require('../models/model.replyComment');
const userModel = require('../models/model.user');
const jwt = require('jsonwebtoken');
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
//[GET] get detail
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
  
  add = async (req, res, next) => {
    try {
      // Kiểm tra xem người dùng đã xác thực chưa
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);

        const { content, product } = req.body;

        // Tạo mới comment với thông tin người dùng đã xác thực
        const newComment = await commentModel.create({ content, user: userId, product });
        console.log(
                '🚀 ~ file: controller.comment.js ~ line 48 ~ CommentController ~ add ~ comment',
                newComment
              );
        res.status(200).json(newComment);
      } else {
        // Trường hợp người dùng chưa xác thực
        res.status(401).json({ message: 'Unauthorized: You need to authenticate to add a comment' });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


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
  // DELETE comment
  async admindelete(req, res) {
    try {
      const { id } = req.params;
      // Tìm comment theo id và xóa nó
      const deletedComment = await commentModel.findByIdAndDelete(id);

      // Nếu comment không tồn tại, trả về lỗi 404
      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Xóa các reply comment liên quan đến comment này
      await replyCommentModel.deleteMany({ _id: { $in: deletedComment.replyComment } });
      console.log(req.body.user)
      return res.redirect('/comment-manager/list');
      
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  }

delete = async (req, res, next) => {
  try {
    // Kiểm tra xem người dùng đã xác thực chưa
    if (req.headers['authorization']) {
      const userToken = req.headers['authorization'].split(' ')[1];
      const { _id: userId } = jwt.decode(userToken);

      const commentId = req.params.id;

      // Tìm comment theo id và user, sau đó xóa nếu tìm thấy
      const deletedComment = await commentModel.findOneAndDelete({ _id: commentId, user: userId });

      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      // Trường hợp người dùng chưa xác thực
      res.status(401).json({ message: 'Unauthorized: You need to authenticate to delete a comment' });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

 }

module.exports = new CommentController();
