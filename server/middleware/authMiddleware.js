const jwt = require('jsonwebtoken');

const JWT_SECRET = 'ilap_super_secret_key_2026'; // Trong thực tế nên để ở .env

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ success: false, message: 'No token provided.' });

  // Token thường có dạng "Bearer <token>"
  const tokenParts = token.split(' ');
  const tokenString = tokenParts.length === 2 ? tokenParts[1] : tokenParts[0];

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
