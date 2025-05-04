const mongoose = require("mongoose");

// ✅ Önce commentSchema'yı tanımla
const commentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  text: String,
  playTime: Number,
});

// ✅ Sonra GameSchema içinde comments: [commentSchema] olarak tanımla
const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genres: { type: [String], required: true },
  photo: { type: String, required: true },
  playTime: { type: Number, default: 0 },
  rating: { type: Number, default: 0, required:true },
  isRatingEnabled: { type: Boolean, default: true },
  releaseDate: { type: Date },
  comments: [commentSchema], // ❗ DÜZELTİLDİ
});

const Game = mongoose.model('Game', GameSchema);
module.exports = Game;
