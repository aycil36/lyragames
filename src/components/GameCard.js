import React from "react";
import { Link } from "react-router-dom";
import "../styles/GameCard.css";

function GameCard({ id,title, image, link }) {
  return (
    <div className="game-card">
      <img src={image} alt={title} className="game-image" />
      <h3 className="game-title">{title}</h3>
      <Link to={`/games/${id}`} className="play-button">Oyna</Link>
 
    </div>
  );
}

export default GameCard;