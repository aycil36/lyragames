import React, { useState } from 'react';
import Logo from "../assets/cute-cartoon-satan-drawing-kawaii-600nw-1880251471.jpg.webp";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Menü açık/kapalı durumu

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    navigate("/login"); // Çıkış yaptıktan sonra login sayfasına yönlendir
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Menü durumunu değiştir
  };
  

  return (
    <div className="navbar">
      <div className="leftSide">
        <img src={Logo} alt="Logo" />
        <span className="siteName">LYRA GAMES</span>
      </div>
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
        {localStorage.getItem("loggedInUser") && (
        <button onClick={handleLogout} className="logout-button">Logout</button>)}

        <div className="menu">
          <button onClick={toggleMenu} className="menu-button">
            Menu
          </button>
          {menuOpen && ( // Menü açıkken seçenekleri göster
            <div className="dropdown">
              <Link to="/games" onClick={() => setMenuOpen(false)}>GamePage</Link>
              <Link to="/user" onClick={() => setMenuOpen(false)}>UserPage</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
