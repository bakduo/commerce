const jwt = require('jsonwebtoken');
const config = require('../config/index');

exports.checkToken = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.secret);
    console.log(token);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' });
  }
};
