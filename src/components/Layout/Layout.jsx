// src/components/Layout/Layout.js

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  // Tüm uygulama boyunca kullanılacak device listesi.
  const [devices, setDevices] = useState([]);

  // Sidebar açık/kapalı durumunu tutan state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sidebar'ı açıp kapatmayı sağlayan fonksiyon
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-textColor">
      {/* Sidebar */}
      <Sidebar
        devices={devices}
        setDevices={setDevices}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Sağda (Sidebar'dan geri kalan) alan */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (örnek: mobilde hamburger butonuyla da sidebar'ı açıp kapatabilir) */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Sayfa içerikleri */}
        <main className="p-4">
          <Outlet context={[devices, setDevices]} />
        </main>
      </div>
    </div>
  );
}

export default Layout;
