const express = require("express");
const router = express.Router();
const Theater = require("../models/Theater");

function validateTheater(body) {
  if (!body.name || body.name.trim() === '') return 'Theater Name is required';
  if (!body.address || body.address.trim() === '') return 'Address is required';
  if (!body.city || body.city.trim() === '') return 'City is required';
  if (!body.total_seats || isNaN(body.total_seats)) return 'Total Seats is required';
  if (!body.screens || isNaN(body.screens)) return 'Number of Screens is required';
  if (!body.contact_number || body.contact_number.trim() === '') return 'Contact Number is required';
  return null;
}

router.get("/", async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  const error = validateTheater(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.json({ message: "Theater Added Successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const error = validateTheater(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.json({ message: "Theater Updated", theater });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Theater.findByIdAndDelete(req.params.id);
    res.json({ message: "Theater Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;