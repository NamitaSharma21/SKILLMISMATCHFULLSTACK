import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [dropdown, setDropdown] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("score");
    localStorage.removeItem("domain");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        Skill Mismatch Roadmap Generator
      </div>

      {/* Links */}
      <div className="nav-links">

        {/* Guest UI */}
        {!user ? (
          <>
            <NavLink to="/login" className="btn">Login</NavLink>
            <NavLink to="/signup" className="btn">Signup</NavLink>
          </>
        ) : (
          <>
            {/* Main Links */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/domain"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Domain
            </NavLink>

            <NavLink
              to="/roadmap"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Roadmap
            </NavLink>

            {/* USER DROPDOWN */}
            <div className="user-menu">
              <span onClick={() => setDropdown(!dropdown)}>
                👤 {user.name} ▾
              </span>

              {dropdown && (
                <div className="dropdown">
                  <p onClick={() => navigate("/roadmap")}>My Roadmap</p>
                  <p onClick={() => navigate("/domain")}>Change Domain</p>
                  <p onClick={logout}>Logout</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;