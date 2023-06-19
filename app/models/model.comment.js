const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const commentSchema = new Schema(
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
    replyComment: [{ type: ObjectId, ref: 'replyComment' }],
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'comment' }
);
//create Schema model
module.exports = model('comment', commentSchema);
