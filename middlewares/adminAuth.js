const jwt = require('jsonwebtoken');
const config = process.env;

const adminAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    if (decoded.role !== 'admin') {
      console.log(false);
    }
    req.user = decoded;
    next();
  } catch {
    res.redirect('/login');
  }
};
module.exports = adminAuth;
