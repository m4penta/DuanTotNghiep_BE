const orderModel = require('../models/model.order');

class OrderController {
  index = async (req, res) => {
    const data = await orderModel.find({});
    return res.status(200).render('template/order/orderList', {
      data,
    });
  };

  store = async (req, res) => {
    const data = req.body;
    await orderModel.create(data);
    return res.status(200).json({
      status: 200,
      // mes: ' success'
    });
  };

  destroy = async (req, res) => {
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.findByIdAndRemove(query).exec();
    return res.redirect('/order');
  };

  update = async (req, res) => {
    const update = {
      status: 'Đang giao',
    };
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.updateOne(query, update);
    return res.redirect('/order');
  };
  updateNext = async (req, res) => {
    const update = {
      status: 'Đã giao',
    };
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.updateOne(query, update);
    return res.redirect('/order');
  };
}

module.exports = new OrderController();
