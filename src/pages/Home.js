import React, { useState } from "react";
import "../styles/Home.css";
import config from '../config';

function Home() {
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
  const role = localStorage.getItem("role");

  const handleSubmit = async () => {
    try {
      let response;
      const headers = { "Content-Type": "application/json" };

      if (modalType === "addGame") {
        response = await fetch(`${config.apiUrl}/games`, {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
      } else if (modalType === "removeGame") {
        response = await fetch(
          `${config.apiUrl}/games/${formData.name}`,
          {
            method: "DELETE",
          }
        );
      } else if (modalType === "addUser") {
        response = await fetch(`${config.apiUrl}/users`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name: formData.name }), // Only send name
        });
      } else if (modalType === "removeUser") {
        response = await fetch(
          `${config.apiUrl}/users/${formData.name}`,
          {
            method: "DELETE",
          }
        );
      } else if (modalType === "disableRating") {
        response = await fetch(
          `${config.apiUrl}/users/${formData.name}/ratingStatus`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ canRate: false }),
          }
        );
      } else if (modalType === "enableRating") {
        response = await fetch(
          `${config.apiUrl}/users/${formData.name}/ratingStatus`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ canRate: true }),
          }
        );
      }

      const result = await response.json();
      console.log("İşlem sonucu:", result);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }

    setModalType(null);
    setFormData({});
  };

  return (
    <div className="homepage">
      <h1 className="welcome-text">
        {role === "admin"
          ? `Welcome, Admin (${loggedInUser}). Use the buttons below to manage the system.`
          : `Welcome, ${loggedInUser}. Nice come back!.`}
      </h1>

      <img
        src={require("../assets/CC899A6F-2C69-4EB2-826E-3382A8A3C7EE.png")}
        alt="decoration"
        className="floating-img"
      />

      {role === "admin" && (
        <div className="actions">
          <button onClick={() => setModalType("addGame")}>Add Game</button>
          <button onClick={() => setModalType("removeGame")}>Remove Game</button>
          <button onClick={() => setModalType("addUser")}>Add User</button>
          <button onClick={() => setModalType("removeUser")}>Remove User</button>
          <button onClick={() => setModalType("disableRating")}>Disable Rating</button>
          <button onClick={() => setModalType("enableRating")}>Enable Rating</button>
        </div>
      )}

      {modalType && (
        <div className="modal">
          <h2>{modalType.replace(/([A-Z])/g, " $1")}</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            onChange={handleInputChange}
          />
          {modalType === "addGame" && (
            <>
              <input
                type="text"
                name="photo"
                placeholder="Enter photo URL"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="genres"
                placeholder="Enter genres (comma separated)"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="releaseDate"
                placeholder="Enter release date (YYYY-MM-DD)"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="developer"
                placeholder="Enter developer"
                onChange={handleInputChange}
              />
            </>
          )}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Home;
