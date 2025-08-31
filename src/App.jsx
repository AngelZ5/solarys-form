import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/painel-admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
