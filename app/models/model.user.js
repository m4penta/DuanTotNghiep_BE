const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    address: String,
    password: String,
    role: { type: String, default: 'user' },
    image: String,
    dayOfBirth: String,
    gender: String,
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'user' }
);

module.exports = model('user', userSchema);
