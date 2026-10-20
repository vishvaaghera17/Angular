const express = require("express");
const router = express.Router();
const Show = require("../models/Show");

function validateShow(body) {
  if (!body.movieName || body.movieName.trim() === '') return 'Please select a Movie';
  if (!body.theaterName || body.theaterName.trim() === '') return 'Please select a Theater';
  if (!body.screenNumber || isNaN(body.screenNumber)) return 'Screen Number is required';
  if (!body.showDate || body.showDate.trim() === '') return 'Show Date is required';
  if (!body.showTime || body.showTime.trim() === '') return 'Please select a Show Time';
  if (!body.ticketPrice || isNaN(body.ticketPrice)) return 'Ticket Price is required';
  return null;
}

router.get("/", async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", async (req, res) => {
  const error = validateShow(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const show = new Show(req.body);
    await show.save();
    res.json({ message: "Show Added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding show", error: err });
  }
});

router.put("/:id", async (req, res) => {
  const error = validateShow(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show Updated", show });
  } catch (err) {
    res.status(500).json({ message: "Error updating show", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ message: "Show Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting show", error: err });
  }
});

module.exports = router;