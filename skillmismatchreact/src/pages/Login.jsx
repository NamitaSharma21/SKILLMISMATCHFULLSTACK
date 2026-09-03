import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showWaitPopup, setShowWaitPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
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

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      const userId = res.data.user._id || res.data.user.email;

      const hasUserRoadmap = [
        "React Development_Web Development",
        "Python & ML_AI/ML",
        "Cyber Security_Cyber Security",
      ].some((roadmap) =>
        localStorage.getItem(`roadmap_${userId}_${roadmap}`)
      );

      if (!hasUserRoadmap) {
        localStorage.setItem("course", "general");
        localStorage.setItem("domain", "general");
      }


      window.dispatchEvent(new Event("authChange"));

      alert(res.data.message);

      navigate("/");
    } catch (err) {
      setShowWaitPopup(false);

      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>

      {/* WAIT POPUP */}
      {showWaitPopup && (
        <div className="wait-overlay">
          <div className="wait-popup">
            <div className="loader"></div>

            <h3>Please Wait...</h3>

            <p>Logging you in</p>
            <p>Getting things ready for you... This may take a few seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;