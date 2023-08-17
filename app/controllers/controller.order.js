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
  // PUT api/store/update/:id
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
//   updateOrderById = async (req, res, next) => {
//     try {
//         if (req.headers['authorization']) {
//             const userToken = req.headers['authorization'].split(' ')[1];
//             // const { _id: userId } = jwt.decode(userToken);
//             const orderId = req.params.id; // Lấy orderId từ tham số URL
//             const productId = req.body.productId; // Lấy productId từ dữ liệu body
//             const newQuantity = req.body.quantity; // Lấy quantity mới từ dữ liệu body
            
//             // Tìm đơn hàng dựa trên orderId và userId
//             const order = await orderModel.findById(orderId);
            
//             if (!order) {
//                 return res.status(404).json({ message: 'Order not found' });
//             }
            
//             // Kiểm tra xem đơn hàng thuộc về người dùng đã xác thực
//             // if (order.userId !== userId) {
//             //     return res.status(403).json({ message: 'Access denied' });
//             // }
            
//             // Tìm sản phẩm trong giỏ hàng dựa trên productId
//             const productInCart = order.cart.find(item => item._id.toString() === productId);
            
//             if (!productInCart) {
//                 return res.status(404).json({ message: 'Product not found in cart' });
//             }
            
//             // Cập nhật giá trị quantity mới cho sản phẩm
//             productInCart.quantity = newQuantity;
            
//             // Lưu lại đơn hàng đã cập nhật
//             const updatedOrder = await order.save();
            
//             res.json(updatedOrder);
//         }
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// [GET] api/store/:id
  GetOderById  = async (req, res, next) => {
    try {
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        const orderId = req.params.id; // Lấy orderId từ tham số URL

        // Kiểm tra orderId nếu cần thiết (vd: validate orderId có hợp lệ)

        // Tìm đơn hàng dựa trên orderId và userId
        const order = await orderModel.findById({
          _id: orderId,
          userId: userId,
        });

        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        // Kiểm tra xem đơn hàng thuộc về người dùng đã xác thực
        if (order.userId !== userId) {
          return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  // updateOrderById  = async (req, res, next) => {
  //   try {
  //     //console.log(req.headers);
  //     if (req.headers['authorization']) {
  //       const userToken = req.headers['authorization'].split(' ')[1];
  //       //const { _id: userId } = jwt.decode(userToken);
  //       const updatedData = req.body;
  //       const orderId = req.params.id;// Lấy orderId từ tham số URL
  //       console.log(orderId);
  //       // Kiểm tra orderId nếu cần thiết (vd: validate orderId có hợp lệ)
  
  //       // Update đơn hàng dựa trên orderId và userId
  //       const updatedOrder = await orderModel.findByIdAndUpdate(
  //               orderId,
  //               updatedData,
  //               { new: true }
  //             );
  
  //       if (!updatedOrder) {
  //         return res.status(404).json({ message: 'Order not found' });
  //       }
  
  //       res.status(200).json(updatedOrder);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };


  deleteOrderById  = async (req, res, next) => {
    try {
      //console.log(req.headers);
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        const orderId = req.params.id; // Lấy orderId từ tham số URL
        console.log(orderId);
        // Kiểm tra orderId nếu cần thiết (vd: validate orderId có hợp lệ)
  
        // Xóa đơn hàng dựa trên orderId và userId
        const deletedOrder = await orderModel.findByIdAndRemove({
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
