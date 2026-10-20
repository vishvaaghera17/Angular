const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

movieId:String,
title:String,
description:String,
duration:String,
genre:String,
language:String,
releaseDate:String,
status:String,
image:String

});

module.exports = mongoose.model("Movie", movieSchema);