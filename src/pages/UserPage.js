import React, { useEffect, useState } from "react";
import "../styles/UserPage.css";
import backgroundImage from "../assets/sticker4.jpeg";
import config from '../config'; 

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetch(`${config.apiUrl}/users`)


      .then((res) => {
        if (!res.ok) throw new Error("Kullanıcılar alınamadı.");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kullanıcıları getirirken hata:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const backgroundStyles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "120vh",
    padding: "20px",
    color: "white"
  };

  return (
    <div className="user-page" style={backgroundStyles}>
      <h1>All Users</h1>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} className="user-card">
            <strong>{user.name}</strong><br />
            Average Rating: {user.averageOfRating}<br />
            Total Play Time: {user.totalPlayTime} hours<br />
            Most Played Game: {user.mostPlayedGame || "Not specified"}<br />
            Can Rate: {user.canRate ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
