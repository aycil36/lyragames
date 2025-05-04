import React, { useEffect, useState } from "react";
import "../styles/UserProfile.css"; // Stil dosyası varsa
import config from '../config'; 

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("loggedInUser");


  useEffect(() => {
    if (!username) {
      alert("You have to do login.");
      return;
    }

    fetch(`${config.apiUrl}/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kullanıcı bulunamadı");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched user:", data); // 🟡 BAK BURAYA
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setLoading(false);
      });
  }, [username]);

  if (!username) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData || Object.keys(userData).length === 0) {
    return <p>No user data found.</p>;
  }

  return (
    <div className="user-profile">
      <div className="user-profile-card">
        <h2>{userData.name}</h2>
        <p><strong>Average Rating:</strong> {userData.averageOfRating}</p>
        <p><strong>Total Play Time:</strong> {userData.totalPlayTime} hours</p>
        <p><strong>Most Played Game:</strong> {userData.mostPlayedGame || "Not specified"}</p>
  
        <h3>Comments</h3>
        {userData.comments && userData.comments.length > 0 ? (
          <ul>
            {userData.comments.map((comment, index) => (
              <li key={index}>
                On <strong>{comment.gameName}</strong>: {comment.text} ({comment.playTime} hours, {comment.rating} stars)
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't commented on any games yet.</p>
        )}
        </div>
    
      <h1>{userData.name} Profile</h1>
      <p><strong>Average rating:</strong> {userData.averageOfRating}</p>
      <p><strong>Total play time:</strong> {userData.totalPlayTime} saat</p>
      <p><strong>Most played game:</strong> {userData.mostPlayedGame || "Belirtilmemiş"}</p>

      <h2>Comments:</h2>
      {userData.comments && userData.comments.length > 0 ? (
        userData.comments.map((comment, index) => (
          <div key={index} className="comment-box">
            <strong>{comment.gameName}</strong><br />
            {comment.text} ({comment.playTime} saat, {comment.rating} yıldız)
          </div>
        ))
      ) : (
        <p>You haven't commented on any games yet.</p>
      )}
    </div>
  );
}

export default UserProfile;
