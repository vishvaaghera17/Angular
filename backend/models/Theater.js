const mongoose = require("mongoose");

const theaterSchema = mongoose.Schema({
    name: String,
    address: String,
    city: String,
    total_seats: Number,
    screens: Number,
    contact_number: String
});

module.exports = mongoose.model("Theater", theaterSchema);