import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home/Home.js";
import Auth from "./pages/Auth/Auth";
import WebSocketProvider from "./modules/websocket/webSocketProvider";

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
