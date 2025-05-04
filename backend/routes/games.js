const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const User = require("../models/User");

// Tüm oyunları getir
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error('Hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Belirli bir oyunu ID ile getir
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Oyun bulunamadı' });
    }
    res.json(game);
  } catch (err) {
    console.error('Oyun çekilirken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Yeni oyun ekle (admin işlemi)
router.post("/", async (req, res) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.json(savedGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Oyun etkileşimi: yorum + puan + oynama süresi
router.post("/:id/interact", async (req, res) => {
  const gameId = req.params.id;
  const { username, rating, playTime, comment } = req.body;

    // 👉 Bu aşamada gelen verileri yazdır
    console.log("Gelen veri:", { username, rating, playTime, comment });

 // try {
    const parsedRating = Number(rating);
    const parsedPlayTime = Number(playTime);

    if (isNaN(parsedRating) || isNaN(parsedPlayTime)) {
      console.error("❌ Geçersiz sayı girdisi:", { parsedRating, parsedPlayTime });
      return res.status(400).json({ message: "Rating and playTime must be valid numbers." });
    }

    try {
    const game = await Game.findById(gameId);
    const user = await User.findOne({ name: username });

    if (!game || !user) {
      return res.status(404).json({ message: "Game or User not found" });
    }

    if (!game.comments) game.comments = [];
    if (!user.comments) user.comments = [];

    const newComment = {
      userId: user._id,
      username: username,
      text: comment,
      playTime: parsedPlayTime,
      rating: parsedRating,
      gameName: game.name,
    };

    game.comments.push(newComment);

    // Güvenli ortalama hesaplama (game)
    const totalRatings = game.comments.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    game.rating = game.comments.length > 0 ? totalRatings / game.comments.length : 0;
    
    user.comments.push(newComment);
    user.totalPlayTime += parsedPlayTime;
    
    // Güvenli ortalama hesaplama (user)
    const totalUserRatings = user.comments.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    user.averageOfRating = user.comments.length > 0 ? totalUserRatings / user.comments.length : 0;
    
    const playtimeMap = {};
    user.comments.forEach((c) => {
      playtimeMap[c.gameName] = (playtimeMap[c.gameName] || 0) + c.playTime;
    });
    user.mostPlayedGame = Object.entries(playtimeMap).sort((a, b) => b[1] - a[1])[0][0];

    await user.save();
    await game.save();

    return res.status(200).json({ updatedGame: game, updatedUser: user });
  } catch (error) {
    console.error("Veri kaydederken hata:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

// Oyun güncelle (admin işlemi)
router.put("/:id", async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGame) {
      return res.status(404).json({ message: "Oyun bulunamadı." });
    }
    res.json(updatedGame);
  } catch (err) {
    console.error("Oyun güncellenirken hata:", err);
    res.status(500).json({ message: "Oyun güncellenirken hata." });
  }
});

// Oyun sil (admin işlemi)
router.delete("/:name", async (req, res) => {
  try {
    const result = await Game.deleteOne({ name: req.params.name });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Oyun bulunamadı." });
    res.json({ message: "game is deleted." });
  } catch (err) {
    res.status(500).json({ message: "error in the deleting status." });
  }
});

module.exports = router;
