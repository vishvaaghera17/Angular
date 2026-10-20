// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/theater", require("./routes/theaterRoutes"));
app.use("/api/shows", require("./routes/showRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/uploads", express.static("uploads"));
// DB Connect
mongoose.connect("mongodb://127.0.0.1:27017/mv_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on 5000"));