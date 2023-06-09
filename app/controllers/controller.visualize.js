const ProductModel = require('../../app/models/model.product');
const OrderModel = require('../../app/models/model.order');
const UserModel = require('../../app/models/model.user');

class AuthController {
  async index(req, res) {
    try {
      const orders = await OrderModel.find();
      const productAmount = await ProductModel.count();
      const userAmount = await UserModel.count();
      const orderAmount = orders.length;
      const sales = orders.reduce((prev, curr) => prev + curr.priceTotal, 0);
      return res.status(200).render('template/visualize/index', {
        sales,
        productAmount,
        userAmount,
        orderAmount,
      });
    } catch (error) {
      res.status(300).redirect('/');
    }
  }
}

module.exports = new AuthController();
