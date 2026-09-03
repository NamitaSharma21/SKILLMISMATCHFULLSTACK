import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showWaitPopup, setShowWaitPopup] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Show wait popup
      setShowWaitPopup(true);

      // Automatically hide popup after 2 seconds
      setTimeout(() => {
        setShowWaitPopup(false);
      }, 2000);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          username,
          email,
          password,
        }
      );

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      setShowWaitPopup(false);

      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {/* WAIT POPUP */}
      {showWaitPopup && (
        <div className="wait-overlay">
          <div className="wait-popup">
            <div className="loader"></div>

            <h3>Please Wait...</h3>

            <p>Creating your account</p>
            <p>Getting things ready for you... This may take a few seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;