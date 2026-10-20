const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User Registered" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* USER LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.password !== password) return res.status(401).json({ message: "Wrong Password" });

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, role: "user" },
      "SECRET123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "User Login Success",
      role: "user",
      token: token,   // ✅ send token
      user: user      // ✅ send user object
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET ALL USERS */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* UPDATE USER */
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE USER */
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;