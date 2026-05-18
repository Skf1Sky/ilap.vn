const rateLimit = require('express-rate-limit');

// Giới hạn login 5 lần mỗi 15 phút
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Giới hạn API cơ bản, vd: 100 request/15 phút
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Giới hạn đặt hàng (10 đơn/giờ) để chống spam
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { success: false, message: 'Too many orders created, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    apiLimiter,
    orderLimiter
};
