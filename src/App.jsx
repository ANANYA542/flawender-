import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ChatBot from "./component/InputCard";
import OutputCard from "./component/outputcard";
import Home from "./component/home";
import Features from "./component/Features";
import Dashboard from "./component/Dashboard";

const App = () => {
  const [botDictionary, setBotDictionary] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/chat"
            element={
              <>
                <ChatBot setBotDictionary={setBotDictionary} />
                {/* <OutputCard botDictionary={botDictionary} /> */}
              </>
            }
          />
          <Route path="/output-card" element={<OutputCard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
