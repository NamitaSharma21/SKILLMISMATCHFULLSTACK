import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Domain from "./pages/Domain";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";
import VerificationTest from "./pages/VerificationTest";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/domain"
        element={
          isLoggedIn ? <Domain /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/roadmap"
        element={
          isLoggedIn ? <Roadmap /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/verification-test"
        element={
          isLoggedIn ? <VerificationTest /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;