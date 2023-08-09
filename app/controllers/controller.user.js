const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/model.user');

class AuthController {
  async login(req, res) {  //xử lý việc người dùng đăng nhập
    try {
      // trích xuất email và password từ phần thân của yêu cầu sử dụng việc giải nén (destructuring assignment)
      const { email, password } = req.body;
      //kiểm tra xem cả email và password có được cung cấp trong yêu cầu
      if (!(email && password)) { 
        return res
          .status(400)
          .json({ status: false, message: 'All input is required!' });
      }
      //tìm một người dùng với địa chỉ email đã cung cấp
      const user = await userModel.findOne({ email }); 

      if (!user) { //Nếu không tìm thấy người dùng với địa chỉ email
        return res
          .status(400)
          .json({ status: false, message: 'Email is not existed!' });
      }
      // tiến hành so sánh mật khẩu được cung cấp với mật khẩu đã được lưu trữ sử dụng bcrypt.compare
      if (user && (await bcrypt.compare(password, user.password))) {
        //tạo một đối tượng userSign chứa một số chi tiết về người dùng
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          image: user.image,
          dayOfBirth: user.dayOfBirth,
          gender: user.gender,
        };
        console.log(
          '🚀 ~ file: controller.user.js ~ line 34 ~ AuthController ~ login ~ userSign',
          userSign
        );
        // tạo một mã thông báo (token) sử dụng đối tượng userSign, 
        // một khóa bí mật từ biến môi trường (TOKEN_KEY), và thời gian hết hạn sau 2 giờ.
        const token = jwt.sign(userSign, process.env.TOKEN_KEY, {
          expiresIn: '2h',
        });
        console.log(
          '🚀 ~ file: controller.user.js ~ line 37 ~ AuthController ~ login ~ token',
          token
        );
        return res.status(200).json({ token });
      }
      res.status(400).json({ status: false, message: 'Invalid Credentials' });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }
  async register(req, res) {
    try {
      //trích xuất thông tin người dùng từ phần thân của yêu cầu
      const { firstName, lastName, email, password, role, image } = req.body;

      // bất kỳ trường thông tin nào bị thiếu (null hoặc không tồn tại),
      // một phản hồi lỗi 400 Bad Request sẽ được trả về, cho biết cần phải nhập đủ thông tin.
      if (!(firstName && lastName && email && password && role && image)) {
        return res.status(400).json({ message: 'All input is required!' });
      }

      //kiểm tra xem người dùng với địa chỉ email đã cung cấp đã tồn tại chưa
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: 'User email already exist!' });
      }

      // mã sử dụng bcrypt.hash để mã hóa mật khẩu mới của người dùng với mức độ an toàn là 10 
      // (có nghĩa là thời gian mã hóa mật khẩu sẽ mất khoảng 2^10 lần so với mật khẩu gốc).
      const encryptedPassword = await bcrypt.hash(password, 10);

      //tạo một người dùng mới trong cơ sở dữ liệu
      const user = await userModel.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        role,
        image,
      });
      //mã tạo một mã thông báo (token) JSON Web Token (JWT) bằng cách sử dụng thông tin của người dùng
      const token = jwt.sign(
        {
          user_id: user._id,
          firstName,
          lastName,
          email,
          role,
          image,
        },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );
      user.token = token;
      return res.status(200).json({ status: true, user });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }
  // Admin
  async userGetList(req, res) {
    try {
      const users = await userModel.find().select('-password');
      return res
        .status(200)
        .render('template/user/list', { message: '', users });
    } catch (error) {
      return res.status(400).redirect('/');
    }
  }
  // async userAuthorize(req, res) {
  //   const { id } = req.params;
  //   if (id) {
  //     try {
  //       await userModel.update({ _id: id }, { role: 'admin' });
  //       res.status(300).redirect('/user-manager/list');
  //     } catch (error) {
  //       res.status(300).redirect('/user-manager/list');
  //     }
  //   }
  // }
  async userAuthorize(req, res) {
    const { id } = req.params;
    if (id) {
      try {
        await userModel.updateOne({ _id: id }, { role: 'admin' });
        res.status(300).redirect('/user-manager/list');
      } catch (error) {
        res.status(300).redirect('/user-manager/list');
      }
    }
  }
  // async userUnAuthorize(req, res) {
  //   const { id } = req.params;
  //   if (id) {
  //     try {
  //       await userModel.update({ _id: id }, { role: 'user' });
  //       res.status(300).redirect('/user-manager/list');
  //     } catch (error) {
  //       res.status(300).redirect('/user-manager/list');
  //     }
  //   }
  // }

  async userUnAuthorize(req, res) {
    const { id } = req.params;
    if (id) {
      try {
        await userModel.updateOne({ _id: id }, { role: 'user' });
        res.status(300).redirect('/user-manager/list');
      } catch (error) {
        res.status(300).redirect('/user-manager/list');
      }
    }
  }
  //[get] /user/:id/edit
  async userGetByid(req, res) {
    try {
      const users = await userModel.findById(req.params.id).select('-password');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: 'Error getting user' });
    }
  }
  //[get] /user/allUser
  // users get edit deltail by themserft
  async apiUserPostEdit(req, res) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res
          .status(400)
          .json({ status: false, message: 'All input is required!' });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: 'Email is not existed!' });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          image: user.image,
          dayOfBirth: user.dayOfBirth,
          gender: user.gender,
        };
        console.log(
          '🚀 ~ file: controller.user.js ~ line 34 ~ AuthController ~ login ~ userSign',
          userSign
        );
        const token = jwt.sign(userSign, process.env.TOKEN_KEY, {
          expiresIn: '2h',
        });
        console.log(
          '🚀 ~ file: controller.user.js ~ line 37 ~ AuthController ~ login ~ token',
          token
        );
        return res.status(200).json({ token, userSign });
      }
      res.status(400).json({ status: false, message: 'Invalid Credentials' });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }

  //[PUT] /users/:id/update
  // async userUpdate(req, res, next) {
  //   try {
  //     await userModel.updateOne({ _id: req.params.id }, req.body);
  //     return res.status(200).json({ message: 'User updated successfully' });
  //   } catch (error) {
  //     return res.status(400).json({ message: 'Error updating user' });
  //   }
  // }
  // async userGetUpdate(req, res, next) {
  //   try {
  //     const updatedUser = await userModel.findByIdAndUpdate(
  //       { _id: req.params.id },
  //       req.body,
  //       { new: true }
  //     );
  //     if (!updatedUser) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     res.json(updatedUser);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async updateUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true }
      );
      console.log(updatedUser);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
  async getUserInfo(req, res) {
    try {
      console.log(req.headers);
      if (req.headers['authorization']) {
        const userToken = req.headers['authorization'].split(' ')[1];
        const { _id: userId } = jwt.decode(userToken);
        console.log({ userId });
        const userData = await userModel.findById(userId);
        res.status(200).json(userData);
      }
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}

module.exports = new AuthController();
