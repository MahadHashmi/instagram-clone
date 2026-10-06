import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ currentUser, users, onSwitchUser }) {
  const navigate = useNavigate();

  const handleSwitch = (e) => {
    onSwitchUser(e.target.value);
    navigate(`/profile/${e.target.value}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <h1 className="logo">Instagram</h1>
      </Link>

      <input className="search" placeholder="Search" />

      <div className="nav-icons">
        <Link to="/">🏠</Link>
        <Link to="/explore">🧭</Link>
        <Link to={`/profile/${currentUser}`}>👤</Link>

        <select
          value={currentUser}
          onChange={handleSwitch}
          className="user-switch"
        >
          {users.map((u) => (
            <option key={u.username} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <Link to="/create-profile" className="new-profile-btn">
          + New
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;