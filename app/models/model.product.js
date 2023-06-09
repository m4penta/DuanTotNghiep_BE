const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const imageSchema = {
  _id: { type: ObjectId, auto: true },
  key: { type: String },
  location: { type: String },
  size: { type: Number },
  versionId: { type: String },
};

const productSchema = new Schema(
  {
    _id: { type: ObjectId, auto: true },
    name: String,
    option: [
      {
        _id: { type: ObjectId, auto: true },
        price: { type: Number },
        value: { type: String },
      },
    ],
    color: [
      {
        _id: { type: ObjectId, auto: true },
        name: { type: String },
      },
    ],
    discount: { type: Number, default: 0 },
    flash_sale: { type: Boolean, default: false },
    flash_sale_until: { type: Date, default: Date.now() },
    view: { type: Number, default: 0 },
    brand: { type: ObjectId, ref: 'brand' },
    category: {
      ref: 'category',
      type: ObjectId,
    },
    thumbnail: imageSchema,
    product_image: [imageSchema],
    banner_image: imageSchema,
    specification: [[String]],
    article: { type: String },
    slug: { type: String },
    amount: { type: Number },
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'product' }
);

module.exports = model('product', productSchema);
