const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

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
      // Tương lai: Khi tất cả đã mã hóa thì dùng cái này
      // Hiện tại nếu db vẫn còn text thô, có thể xử lý fallback tạm, 
      // nhưng vì ta đổi sang bcrypt, ta nên yêu cầu mã hóa hết.
      // Dưới đây chỉ check bcrypt.
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    // Tạo JWT token expire trong 12h
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: 43200 // 12 hours
    });

    res.json({ success: true, message: "Login success", token, role: user.role });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

const seedAdmin = async (req, res) => {
  try {
    const defaultUsername = 'admin';
    const defaultPassword = '1';
    
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
  seedAdmin
};
