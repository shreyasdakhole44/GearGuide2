import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import SentinelPage from './pages/SentinelPage';
import VajraNetPage from './pages/VajraNetPage';
import InventoryMachine from './pages/InventoryMachine';
import MaintenancePortal from './pages/MaintenancePortal';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setAuth(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const Layout = ({ children }) => {
    return (
      <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-500/30">
        <main className="w-full min-h-screen">
          {children}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} setAuth={setAuth} setUser={setUser} />} />
        
        <Route path="/dashboard" element={<Layout><SentinelPage /></Layout>} />
        <Route path="/inventory" element={<Layout><InventoryMachine /></Layout>} />
        <Route path="/maintenance" element={<Layout><MaintenancePortal /></Layout>} />
        <Route path="/vajranet" element={<Layout><VajraNetPage /></Layout>} />
        <Route path="/register" element={<RegisterPage setAuth={setAuth} setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setAuth={setAuth} setUser={setUser} />} />

        <Route path="/assistant" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
