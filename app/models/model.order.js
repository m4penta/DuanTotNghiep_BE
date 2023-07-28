const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
  {
    name: String,
    phone: String,
    address: String,
    email: String,
    node: String,
    cart: Array,
    priceTotal: Number,
    userId: String,
    status: { type: String, default: 'Đang xác nhận' },
  },
  { timestamps: true, collection: 'order' }
);

module.exports = model('order', orderSchema);
