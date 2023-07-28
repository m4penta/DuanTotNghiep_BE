const orderModel = require('../models/model.order');
const jwt = require('jsonwebtoken');

class OrderController {
  index = async (req, res) => {
    const data = await orderModel.find({});
    return res.status(200).render('template/order/orderList', {
      data,
    });
  };

  // store = async (req, res) => {
  //   const data = req.body;
  //   await orderModel.create(data);
  //   return res.status(200).json({
  //     status: 200,
  //     // mes: ' success'
  //   });
  // };

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
  //restfullAPI
  // GET api/store/allOrder
  getAllOrders = async (req, res, next) => {
    try {
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        const orders = await orderModel.find({ userId });
        res.json(orders);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  // POST api/store/create
  createOrder = async (req, res, next) => {
    try {
      console.log(req.headers);
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        const orderData = req.body;
        const newOrder = await orderModel.create({ ...orderData, userId });
        res.status(201).json(newOrder);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  //PUT api/store/update/:id
  updateOrderById = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const updatedData = req.body;
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        updatedData,
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };
  //DELETE  api/store/delete/:id
  // deleteOrderById = async (req, res, next) => {
  //   const { id } = req.params;
  //   const query = {
  //     _id: id,
  //   };
  //   await orderModel.findByIdAndRemove(query).exec();
  //   return res.json({ message: 'delete succesfully' });
  // };
  deleteOrderById  = async (req, res, next) => {
    try {
      console.log(req.headers);
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        const orderId = req.params.orderId; // Lấy orderId từ tham số URL
  
        // Kiểm tra orderId nếu cần thiết (vd: validate orderId có hợp lệ)
  
        // Xóa đơn hàng dựa trên orderId và userId
        const deletedOrder = await orderModel.findOneAndDelete({
          _id: orderId,
          userId: userId,
        });
  
        if (!deletedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
  
        res.status(200).json({ message: 'Order deleted successfully' });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  // get
  findOrder = async (req, res, next) => {
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.findByIdAndRemove(query).exec();
    return res.json({ message: 'delete succesfully' });
  };
}

module.exports = new OrderController();
