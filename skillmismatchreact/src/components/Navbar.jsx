import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("authChange", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("authChange", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        Skill Mismatch Roadmap Generator
      </div>

      <div className="nav-links">
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/roadmap">Roadmaps</NavLink>

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