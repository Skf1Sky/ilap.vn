const { z } = require('zod');

// Schema validate đăng nhập
const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(1, "Password is required").max(100)
  })
});

// Schema validate tạo đơn hàng
const orderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Phone number must be 10 or 11 digits"),
    address: z.string().min(5, "Address must be at least 5 characters").max(255),
    items: z.array(
      z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
        quantity: z.number().int().positive().optional(),
        price: z.number().positive().optional(),
        name: z.string().optional()
      })
    ).min(1, "Order must contain at least one item")
  })
});

// Middleware tổng quát để kiểm tra z schema
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors[0].message,
      errors: err.errors,
    });
  }
};

module.exports = {
  validate,
  loginSchema,
  orderSchema
};
