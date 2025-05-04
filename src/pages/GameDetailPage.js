import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/GameDetailPage.css";

function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState("");
  const [playTime, setPlayTime] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [canRate, setCanRate] = useState(true);

  const username = localStorage.getItem("loggedInUser");

  useEffect(() => {
    if (!id) {
      console.error("Missing ID parameter!");
      navigate("/");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/games/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching game details:", error);
        setLoading(false);
      });

    fetch(`${process.env.REACT_APP_API_URL}/users/${username}`)
      .then((res) => res.json())
      .then((userData) => setCanRate(userData.canRate))
      .catch((err) => console.error("canRate kontrolü başarısız:", err));
  }, [id, navigate, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const parsedRating = Number(rating);
    const parsedPlayTime = Number(playTime);
  
    console.log("parsedRating:", parsedRating);
    console.log("parsedPlayTime:", parsedPlayTime);
  
    if (isNaN(parsedRating) || isNaN(parsedPlayTime)) {
      alert("Rating and Play Time must be valid numbers.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/games/${game._id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: parsedRating,
          playTime: parsedPlayTime,
          comment,
          username
        }),
      });
  
      if (!response.ok) throw new Error("Server error!");
  
      const { updatedGame } = await response.json();
      setGame(updatedGame);
      setSubmitted(true);
      setRating("");
      setPlayTime("");
      setComment("");
      alert("Your comment was submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submission failed due to server error.");
    }
  };
  
  
  
  // 🔐 Güvenli kontrol
  if (loading) return <p>Loading...</p>;
  if (!game) return <p>Game not found.</p>;

  return (
    <div className="game-detail-page">
      <div className="game-detail-container">
        <div className="left-panel">
          <img src={game?.photo} alt={game?.name || "Game"} />
          <p><strong>Average Rating:</strong> {game.rating || "Not rated yet"}</p>
          <p><strong>Genre:</strong> {game.genres?.join(', ') || 'Not specified'}</p>
          <p><strong>Release Date:</strong> {game.releaseDate || 'Unknown'}</p>
        </div>

        <div className="right-panel">
          <h2>Comments and Ratings</h2>
          {game.comments && game.comments.length > 0 ? (
            game.comments.map((c, i) => (
              <div key={i} className="comment-box">
                <strong>{c.username}</strong> {c.rating && "⭐".repeat(c.rating)}<br />
                {c.text} <span>({c.playTime} hours)</span>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {game.isRatingEnabled && canRate ? (
            <>
              <h3>Leave a Comment & Rate</h3>
              <form onSubmit={handleSubmit} className="interact-form">
                <label>Rating (Stars):</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>

                <label>Play Time (hours):</label>
                <input type="number" value={playTime} onChange={(e) => setPlayTime(e.target.value)} min="1" required />

                <label>Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your thoughts..." required />

                <button type="submit">Submit</button>
                {submitted && <p className="submitted-msg">Submitted successfully!</p>}
              </form>
            </>
          ) : (
            <p style={{ color: 'red' }}>Rating and comments are disabled for this game or you are not authorized.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameDetailPage;
