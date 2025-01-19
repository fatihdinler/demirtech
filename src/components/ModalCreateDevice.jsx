import React, { useState } from "react";

function ModalCreateDevice({ setIsModalOpen, devices, setDevices }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");
  const [tolerance, setTolerance] = useState("");

  const handleSave = () => {
    // Yeni cihaz objesi oluştur
    const newDevice = {
      name,
      description,
      color,
      min: minVal,
      max: maxVal,
      tolerance,
    };

    // Cihazı listeye ekle
    setDevices([...devices, newDevice]);

    // Modal'ı kapat
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Arka plan karartısı */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      />

      {/* Modal kutusu */}
      <div className="relative bg-white rounded shadow-lg p-6 w-full max-w-md mx-2">
        <h2 className="text-xl font-bold mb-4">Yeni Cihaz Oluştur</h2>

        <label className="block mb-2">
          <span className="text-gray-700">Name:</span>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Description:</span>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Color:</span>
          <input
            type="color"
            className="mt-1 block w-full border border-gray-300 rounded p-1"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <div className="flex gap-2">
          <label className="block mb-2 flex-1">
            <span className="text-gray-700">Min:</span>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={minVal}
              onChange={(e) => setMinVal(e.target.value)}
            />
          </label>

          <label className="block mb-2 flex-1">
            <span className="text-gray-700">Max:</span>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={maxVal}
              onChange={(e) => setMaxVal(e.target.value)}
            />
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-gray-700">Tolerance:</span>
          <input
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            onClick={handleClose}
          >
            İptal
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCreateDevice;
