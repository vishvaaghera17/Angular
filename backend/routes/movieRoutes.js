const express = require("express");
const router = express.Router();
const multer = require("multer");
const Movie = require("../models/Movie");

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage: storage });

// ✅ Server-side validation helper
function validateMovieFields(body) {
  const required = ['movieId', 'title', 'description', 'duration', 'genre', 'language', 'releaseDate', 'status'];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === '') {
      return `${field} is required`;
    }
  }
  return null;
}

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  const error = validateMovieFields(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const movie = new Movie({
      movieId: req.body.movieId,
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      genre: req.body.genre,
      language: req.body.language,
      releaseDate: req.body.releaseDate,
      status: req.body.status,
      image: req.file ? req.file.filename : ""
    });
    await movie.save();
    res.json({ message: "Movie Added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding movie", error: err });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    // Validate edit fields (no movieId needed)
    const editRequired = ['title', 'description', 'duration', 'genre', 'language', 'releaseDate', 'status'];
    for (const field of editRequired) {
      if (!req.body[field] || String(req.body[field]).trim() === '') {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    let releaseDate = req.body.releaseDate;
    if (releaseDate && releaseDate.includes('-')) {
      const parts = releaseDate.split('-');
      if (parts[0].length === 2) releaseDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      genre: req.body.genre,
      language: req.body.language,
      releaseDate: releaseDate,
      status: req.body.status
    };
    if (req.file) updateData.image = req.file.filename;

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie Updated", movie });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating movie", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting movie", error: err });
  }
});

module.exports = router;