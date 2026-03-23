import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import SentinelPage from './pages/SentinelPage';
import VajraNetPage from './pages/VajraNetPage';
import InventoryMachine from './pages/InventoryMachine';
import MaintenancePortal from './pages/MaintenancePortal';

function App() {
  // Authentication check removed as per user request to remove login form
  
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
        <Route path="/" element={<LandingPage />} />
        
        {/* 
            Single-Page AI Interface: 
            Direct access enabled by removing ProtectedRoute
        */}
        <Route path="/dashboard" element={<Layout><SentinelPage /></Layout>} />
        <Route path="/inventory" element={<Layout><InventoryMachine /></Layout>} />
        <Route path="/maintenance" element={<Layout><MaintenancePortal /></Layout>} />
        <Route path="/vajranet" element={<Layout><VajraNetPage /></Layout>} />

        <Route path="/assistant" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
