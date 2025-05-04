const mongoose = require('mongoose');



// ✅ 1. Rating schema'yı tanımla
const ratingSchema = new mongoose.Schema({
  gameId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  playTime: Number,
});

// ✅ 2. ratingSchema'yı userSchema içine dahil et
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalPlayTime: { type: Number, default: 0 },
  averageOfRating: { type: Number, default: 0 },
  mostPlayedGame: { type: String, default: "" },
  ratings: [ratingSchema],
  canRate: { type: Boolean, default: true }, // 🔐 Admin kontrolündedir
  comments: [{
    comment: String,
    playTime: Number,
    gameName: String,
    rating: Number,
  }],
});

// Log the schema for debugging
console.log('User schema fields:', Object.keys(userSchema.paths));

// ✅ 3. OverwriteModelError'dan korunmak için güvenli tanımlama
// Make sure to explicitly use 'users' collection
module.exports = mongoose.models.User || mongoose.model('User', userSchema, 'users');
