const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const categorySchema = new Schema(
  {
    name: String,
    slug: String,
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'category' }
);

module.exports = model('category', categorySchema);
