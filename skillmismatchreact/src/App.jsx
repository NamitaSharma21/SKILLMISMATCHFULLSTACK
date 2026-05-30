import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Domain from "./pages/Domain";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";
import VerificationTest from "./pages/VerificationTest";

function App() {
  const isLoggedIn = !!localStorage.getItem("user");

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