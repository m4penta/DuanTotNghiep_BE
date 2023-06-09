const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const brandSchema = new Schema(
  {
    name: String,
    slug: String,
    image: {
      type: String,
      default:
        'https://www.gravatar.com/avatar/94d093eda664addd6e450d7e9881bcad?s=100&d=identicon&r=PG',
    },
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'brand' }
);

module.exports = model('brand', brandSchema);
