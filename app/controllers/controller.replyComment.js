const ReplyCommentModel = require('../models/model.replyComment');
const CommentModel = require('../models/model.comment');
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
}

module.exports = new ReplyCommentController();
