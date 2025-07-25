import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

// PUBLIC_INTERFACE
function Navbar({ theme, toggleTheme, user, onLoginClick, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold", fontSize: 24, color: "#1a73e8", textDecoration: "none" }}>
          Fundraiser
        </Link>
        <Link to="/" style={{ color: "inherit", marginLeft: 8 }}>
          Campaigns
        </Link>
        {user && (
          <Link to="/dashboard" style={{ color: "inherit", marginLeft: 8 }}>
            Dashboard
          </Link>
        )}
        <Link to="/campaign/new" style={{ color: "inherit", marginLeft: 8 }}>
          Start a Campaign
        </Link>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#1a73e8",
            fontSize: 18,
            marginRight: "1rem",
          }}
          title="Toggle light/dark theme"
        >
          {theme === "light" ? <>🌙</> : <>☀️</>}
        </button>
        {user ? (
          <>
            <span style={{ fontWeight: 500, color: "#34a853" }}>
              {user.name || user.email}
            </span>
            <button className="btn" style={{ marginLeft: 8 }} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn" style={{ marginLeft: 8 }} onClick={onLoginClick}>
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
