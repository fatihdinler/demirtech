import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DeviceDetail from "./pages/Dashboard.jsx";

function App() {
  // Sidebar'ın açık/kapalı durumunu tutan state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tüm cihazları tutan state
  const [devices, setDevices] = useState([]);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* İçerik Alanı (Sidebar + Page Content) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            devices={devices}
            setDevices={setDevices}
          />

          {/* Sayfa İçeriği */}
          <div className="flex-1 bg-gray-100 overflow-auto p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/device/:id" element={<DeviceDetail devices={devices} />} />
              {/* Her durumda / veya bilinmeyen path -> /dashboard'a yönlendir */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
