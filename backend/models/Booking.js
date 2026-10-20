const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  movieName: String,
  theaterName: String,
  showDate: String,
  showTime: String,
  seats: [String],      
  totalPrice: Number
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);