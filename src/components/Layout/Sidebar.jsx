// src/components/Layout/Sidebar.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalCreateDevice from "../ModalCreateDevice";
import { FaPlus, FaTabletAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Sidebar({ devices, setDevices, isSidebarOpen, toggleSidebar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Device listesindeki item'a tıklayınca detail sayfasına gideceğiz.
  const handleDeviceClick = (index) => {
    navigate(`/device/${index}`);
  };

  return (
    <aside
      className={`
        h-screen
        bg-sidebarBg
        border-r border-gray-200
        p-4
        flex flex-col
        transition-all duration-300
        ${isSidebarOpen ? "w-64" : "w-16"}
      `}
    >
      {/* Sidebar'ı açıp kapatan buton (üstte) */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="
            bg-white border border-gray-300 rounded-full
            w-8 h-8 flex items-center justify-center
            text-gray-600 hover:text-primary
          "
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Logo / Başlık (Sidebar açıkken göster, kapalıyken gizle) */}
      <div className={`mb-6 ${!isSidebarOpen && "hidden"}`}>
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          Sneat Devices
        </Link>
      </div>

      {/* + Butonu */}
      <button
        className={`
          w-full flex items-center justify-center gap-2
          bg-primary text-white py-2 px-3 rounded-md shadow-sm
          hover:bg-primary/90 transition-colors mb-4
          ${!isSidebarOpen && "justify-center"}
        `}
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus />
        {/* Sidebar kapalıysa metni gizliyoruz */}
        {isSidebarOpen && <span>Yeni Device Ekle</span>}
      </button>

      {/* Cihaz Listesi */}
      <div className="flex-1 overflow-auto">
        {devices.map((device, index) => (
          <div
            key={index}
            className="
              flex items-center gap-2 p-2 mb-2
              cursor-pointer rounded-md hover:bg-gray-200
            "
            onClick={() => handleDeviceClick(index)}
          >
            <FaTabletAlt className="text-gray-500" />
            {isSidebarOpen && (
              <span className="text-sm text-gray-700">{device.name}</span>
            )}
          </div>
        ))}
      </div>

      {/* ModalCreateDevice */}
      {isModalOpen && (
        <ModalCreateDevice
          setIsModalOpen={setIsModalOpen}
          devices={devices}
          setDevices={setDevices}
        />
      )}
    </aside>
  );
}

export default Sidebar;
