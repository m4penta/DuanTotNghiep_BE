const jwt = require('jsonwebtoken');
const config = process.env;

const vertifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  let bearerToken = null;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
  }
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    bearerToken;
  if (!token) {
    res.status(400).json({
      status: false,
      message: 'A token is required for authentication',
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ status: false, message: 'Invalid token' });
  }
};

module.exports = vertifyToken;
