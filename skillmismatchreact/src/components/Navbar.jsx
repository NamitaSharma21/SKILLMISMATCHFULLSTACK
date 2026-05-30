import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [dropdown, setDropdown] = useState(false);

  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  navigate("/login");
};

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        Skill Mismatch Roadmap Generator
      </div>

      <div className="nav-links">

        {/* GUEST USER */}
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        ) : (
          <>
            {/* MAIN NAV */}
            <NavLink to="/">Home</NavLink>

            <NavLink to="/dashboard">Dashboard</NavLink>

            <NavLink to="/roadmap">Roadmaps</NavLink>

            {/* PROFILE DROPDOWN */}
            <div className="user-menu">

              <span onClick={() => setDropdown(!dropdown)}>
                👤 {user.name} ▾
              </span>

              {dropdown && (
                <div className="dropdown">

                  <p onClick={() => navigate("/dashboard")}>
                    My Dashboard
                  </p>

                  <p onClick={() => navigate("/roadmap")}>
                    My Roadmaps
                  </p>

                  <p onClick={logout}>
                    Logout
                  </p>

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