import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Domain from "./pages/Domain";
import Test from "./pages/Test";
import Roadmap from "./pages/Roadmap";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/domain" element={<Domain />} />
      <Route path="/test" element={<Test />} />
      <Route path="/roadmap" element={<Roadmap />} />
    </Routes>
  );
}

export default App;