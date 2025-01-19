import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalCreateDevice from "./ModalCreateDevice";

function Sidebar({ isSidebarOpen, setIsSidebarOpen, devices, setDevices }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeviceClick = (id) => {
    navigate(`/device/${id}`);
  };

  return (
    <aside
      className={`
        bg-white shadow-md h-full
        flex flex-col
        ${isSidebarOpen ? "w-64" : "w-16"}
        transition-width duration-300
      `}
    >
      {/* Sidebar'ı daraltıp genişleten buton */}
      <div className="p-2 flex justify-end">
        <button
          className="text-gray-500 hover:text-gray-700 transition-colors"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "<" : ">"}
        </button>
      </div>

      {/* + Butonu ve Cihaz Listesi */}
      <div className="flex-1 overflow-auto">
        {/* + Butonu */}
        <div className="p-2">
          <button
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>

        {/* Cihaz Listesi */}
        <ul className="p-2">
          {devices.map((device, index) => (
            <li
              key={index}
              className="mb-2 cursor-pointer p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              onClick={() => handleDeviceClick(index)}
            >
              {device.name}
            </li>
          ))}
        </ul>
      </div>

      {/* ModalCreateDevice Bileşeni */}
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
