const mongoose = require("mongoose");

const showSchema = mongoose.Schema({
  movieName: String,
  theaterName: String,
  screenNumber: Number,
  showDate: String,
  showTime: String,
  ticketPrice: Number
});

module.exports = mongoose.model("Show", showSchema);