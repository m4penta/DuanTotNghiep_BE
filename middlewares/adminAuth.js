const jwt = require('jsonwebtoken'); //yêu cầu thư viện 'jsonwebtoken', cho phép tạo và xác minh các token JWT
const config = process.env; //nó sử dụng biến môi trường để lấy giá trị của TOKEN_KEY

const adminAuth = (req, res, next) => { //sử dụng để kiểm tra xác thực của người dùng có vai trò là admin.
  //token JWT được lưu trong cookie có tên là access_token.
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect('/login');
    //Nếu không tìm thấy token trong cookie, 
    //middleware sẽ chuyển hướng người dùng đến trang đăng nhập.
  }
  try {
    //Thực hiện xác minh token. Nếu token hợp lệ, 
    //nó sẽ kiểm tra xem vai trò của người dùng có phải là "admin" hay không
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    if (decoded.role !== 'admin') {
      console.log(false);
    }
    req.user = decoded;//thông tin giải mã từ token sẽ được gán vào req.user để có thể sử dụng trong các xử lý tiếp theo.
    next();
  } catch {
    res.redirect('/login');
  }
};
module.exports = adminAuth;
