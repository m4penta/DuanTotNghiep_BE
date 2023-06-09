const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const replyCommentSchema = new Schema(
  {
    content: String,
    user: {
      type: ObjectId,
      ref: 'user',
    },
    product: {
      type: ObjectId,
      ref: 'product',
    },
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'reply-comment' }
);

module.exports = model('replyComment', replyCommentSchema);
