import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import "../styles/GamePage.css";
import config from '../config'; 

function GamePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Oyunlar çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="game-page">
      <h1>Games</h1>
      <div className="game-cards-container">
        {loading ? (
          <p>Loading games...</p>
        ) : (
          games.map((game) => (
            <GameCard
              key={game._id}
              id={game._id}
              title={game.name}
              image={game.photo}
              link={`/games/${game._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GamePage;
