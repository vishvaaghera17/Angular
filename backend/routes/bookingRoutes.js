const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

/* GET ALL BOOKINGS */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ADD BOOKING */
router.post("/add", async (req, res) => {
  try {
    // ✅ Always store seats as array
    let seats = req.body.seats;
    if (typeof seats === 'string') {
      seats = seats.split(',').map(s => s.trim()).filter(s => s);
    }
    if (!Array.isArray(seats)) seats = [seats];

    const booking = new Booking({
      userName:    req.body.userName,
      userEmail:   req.body.userEmail,
      movieName:   req.body.movieName,
      theaterName: req.body.theaterName,
      showDate:    req.body.showDate,   // ✅ save date
      showTime:    req.body.showTime,
      seats:       seats,               // ✅ array
      totalPrice:  req.body.totalPrice
    });

    await booking.save();
    res.json({ message: "Booking Added Successfully", booking });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE BOOKING */
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;