const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URL = "mongodb://admin:Thienvip1@192.168.1.30:27017/ilap_shop?authSource=admin";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "admin" }
});

const User = mongoose.model("User", userSchema);

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

// login API
app.post("/login", async (req, res) => {
  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Wrong password"
      });
    }

    res.json({
      success: true,
      message: "Login success",
      role: user.role
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

// get users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// start server
const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running at http://192.168.1.20:${PORT}`);
});