import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";
import CSDPage from "./pages/CSDPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/csd/*" element={<CSDPage />} />
      </Routes>
    </Router>
  );
}

export default App;
