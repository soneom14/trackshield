import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./Register";
import Users from "./Users";
import Scanner from "./scanner.jsx"; // ✅ FIXED LINE

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#001f3f", color: "white" }}>
        <Link to="/" style={{ margin: "10px", color: "white" }}>Register</Link>
        <Link to="/scanner" style={{ margin: "10px", color: "white" }}>Scanner</Link>
        <Link to="/users" style={{ margin: "10px", color: "white" }}>Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;