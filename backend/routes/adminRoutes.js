const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/* ADMIN LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Admin not found" });
    if (admin.password !== password) return res.status(401).json({ message: "Wrong Password" });
    const token = jwt.sign({ id: admin._id, role: "admin" }, "SECRET123", { expiresIn: "1d" });
    res.json({ message: "Admin Login Success", role: "admin", token, admin });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET ALL ADMINS */
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ADD ADMIN */
router.post("/add", async (req, res) => {
  try {
    if (!req.body.username?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!req.body.email?.trim())    return res.status(400).json({ message: "Email is required" });
    if (!req.body.password?.trim()) return res.status(400).json({ message: "Password is required" });

    const existing = await Admin.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "Admin with this email already exists" });

    const admin = new Admin(req.body);
    await admin.save();
    res.json({ message: "Admin Added Successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* UPDATE ADMIN */
router.put("/:id", async (req, res) => {
  try {
    const updateData = { username: req.body.username, email: req.body.email };
    if (req.body.password?.trim()) updateData.password = req.body.password;

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin Updated", admin });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE ADMIN */
router.delete("/:id", async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;