const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ilap_super_refresh_secret_2026';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Tạo accessToken expire trong 15 phút
    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '15m'
    });

    // Tạo refreshToken expire trong 7 ngày
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, message: "Login success", role: user.role });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ success: false, message: "No refresh token provided" });

        jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });

            const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET, {
                expiresIn: '15m'
            });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            res.json({ success: true, message: "Token refreshed" });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.json({ success: true, message: "Logged out successfully" });
};

const seedAdmin = async (req, res) => {
  try {
    const defaultUsername = 'admin';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'StrongAdminPass123!';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const checkUser = await User.findOne({ username: defaultUsername });
    if (checkUser) {
       // Cập nhật lại pass đã mã hóa cho admin
       checkUser.password = hashedPassword;
       await checkUser.save();
       return res.json({ success: true, message: "Đã cập nhật mật khẩu cho admin bằng bcrypt." });
    }

    const newUser = new User({
        username: defaultUsername,
        password: hashedPassword,
        role: 'admin'
    });
    await newUser.save();
    res.json({ success: true, message: "Đã tạo tài khoản admin với bcrypt." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  login,
  refreshToken,
  logout,
  seedAdmin
};
