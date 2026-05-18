const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ilap_super_secret_key_2026';

const verifyToken = (req, res, next) => {
  // Đọc token từ cookie thay vì header
  const token = req.cookies.accessToken || req.headers['authorization'];
  
  if (!token) return res.status(403).json({ success: false, message: 'No token provided.' });

  // Token nếu được truyền qua header thường có dạng "Bearer <token>"
  let tokenString = token;
  if (token.startsWith('Bearer ')) {
    tokenString = token.split(' ')[1];
  }

  jwt.verify(tokenString, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ success: false, message: 'Require Admin Role!' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
  JWT_SECRET
};
