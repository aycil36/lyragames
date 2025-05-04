const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const User = require("../models/User");

// Kullanıcı oyun puanlıyor ve oynama süresi giriyor
router.put("/", async (req, res) => {
  const { userId, gameId, rating, playTime } = req.body;

  if (!userId || !gameId || !rating || !playTime) {
    return res.status(400).json({ message: "Eksik veri gönderildi." });
  }

  try {
    const game = await Game.findById(gameId);
    const user = await User.findById(userId);

    if (!game || !user) {
      return res.status(404).json({ message: "Game veya User bulunamadı." });
    }

    if (!game.isRatingEnabled) {
      return res.status(403).json({ message: "Bu oyun için puanlama kapalı." });
    }

 // Yeni yorum ekle
game.comments.push({
  userId,
  username: user.name,
  text: req.body.comment,  // Frontend bunu göndermeli
  playTime
});
await game.save();

    // Kullanıcının bu oyuna daha önce puan verip vermediğini kontrol et
    const existing = user.ratings.find(r => r.gameId.toString() === gameId);
    const allRatings = user.ratings.map(r => r.rating);
    game.rating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    await game.save();
    
    if (existing) {
      existing.rating = rating;
      existing.playTime = playTime;
    } else {
      user.ratings.push({ gameId, rating, playTime });
    }

    // Toplam oynama süresi ve ortalama puanı hesapla
    user.totalPlayTime = user.ratings.reduce((sum, r) => sum + r.playTime, 0);
    const sorted = [...user.ratings].sort((a, b) => b.playTime - a.playTime);
    user.mostPlayedGame = sorted[0]?.gameId.toString() || "";

    const totalWeighted = user.ratings.reduce((sum, r) => sum + r.rating * r.playTime, 0);
    user.averageOfRatings = user.totalPlayTime > 0 ? (totalWeighted / user.totalPlayTime).toFixed(2) : 0;

    await user.save();

    // Şimdi bu oyunun yeni ortalama puanını hesapla
    const allUsers = await User.find({ "ratings.gameId": gameId });
    let totalGamePlay = 0;
    let totalGameScore = 0;

    allUsers.forEach(u => {
      const r = u.ratings.find(r => r.gameId.toString() === gameId);
      if (r) {
        totalGamePlay += r.playTime;
        totalGameScore += r.rating * r.playTime;
      }
    });

    game.rating = totalGamePlay > 0 ? (totalGameScore / totalGamePlay).toFixed(2) : 0;
    game.playTime = totalGamePlay;
    await game.save();

    res.json({ message: "rate saved.", game, user });
  } catch (err) {
    console.error("rating error:", err);
    res.status(500).json({ message: "server error." });
  }
});

module.exports = router;
