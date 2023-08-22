const ReplyCommentModel = require('../models/model.replyComment');
const CommentModel = require('../models/model.comment');
const jwt = require('jsonwebtoken');
class ReplyCommentController {
  async addReply(req, res) {
    const { product, content, user } = req.body;
    const { id } = req.query;

    try {
      const commentReply = new ReplyCommentModel({
        product,
        content,
        user,
      });
      await ReplyCommentModel.create(commentReply);
      const comment = await CommentModel.findOne({ _id: id });
      comment.replyComment.push(commentReply._id);
      await CommentModel.updateOne({ _id: id }, comment);
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async getComments(req, res) {
    try {
      const ReplyComments = await ReplyCommentModel.find();
      console.log(ReplyComments)
      res.status(200).json(ReplyComments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reply comments', error });
    }
  }
  delete = async (req, res, next) => {
    try {
      console.log(req.headers);
      // Kiểm tra xem người dùng đã xác thực chưa
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
      
        const commentId = req.params.id;
  
        // Tìm comment theo id và user, sau đó xóa nếu tìm thấy
        const deletedComment = await ReplyCommentModel.findOneAndDelete({ _id: commentId, user: userId });
  
        if (!deletedComment) {
            console.log(userToken);
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

module.exports = new ReplyCommentController();
