import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import CampaignList from "./pages/CampaignList";
import CampaignDetail from "./pages/CampaignDetail";
import UserDashboard from "./pages/UserDashboard";
import CampaignForm from "./pages/CampaignForm";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import PaymentModal from "./components/PaymentModal";
import { getCurrentUser } from "./api";
import { ThemeProvider } from "./components/ThemeContext";

// PUBLIC_INTERFACE
function App() {
  // App-wide state
  const [theme, setTheme] = useState("light");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    window.localStorage.getItem("jwt_token") || null
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("jwt_token");
  };
  // PUBLIC_INTERFACE
  const onLoginSuccess = (tok) => {
    setToken(tok);
    window.localStorage.setItem("jwt_token", tok);
    setAuthModalOpen(false);
  };

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <Router>
        <div className="App">
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            onLoginClick={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
          />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <CampaignList
                    user={user}
                    onLogin={() => setAuthModalOpen(true)}
                  />
                }
              />
              <Route
                path="/campaign/:campaignId"
                element={
                  <CampaignDetail
                    user={user}
                    onLogin={() => setAuthModalOpen(true)}
                    onDonateClick={() => setPaymentModalOpen(true)}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <UserDashboard
                    user={user}
                    token={token}
                    onLogin={() => setAuthModalOpen(true)}
                  />
                }
              />
              <Route
                path="/campaign/new"
                element={
                  <CampaignForm
                    user={user}
                    token={token}
                    onLogin={() => setAuthModalOpen(true)}
                  />
                }
              />
              <Route
                path="/campaign/:campaignId/edit"
                element={
                  <CampaignForm
                    user={user}
                    token={token}
                    onLogin={() => setAuthModalOpen(true)}
                  />
                }
              />
            </Routes>
          </main>
          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={onLoginSuccess}
          />
          <PaymentModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            user={user}
            token={token}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
