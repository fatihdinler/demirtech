import React from "react";
import { useParams } from "react-router-dom";

function DeviceDetail({ devices }) {
  const { id } = useParams();
  const device = devices[id];

  // Eğer id geçersizse ya da cihaz bulunamazsa
  if (!device) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Cihaz Bulunamadı</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Device Detail</h2>
      <div className="mb-2">
        <strong>Name:</strong> {device.name}
      </div>
      <div className="mb-2">
        <strong>Description:</strong> {device.description}
      </div>
      <div className="mb-2 flex items-center">
        <strong>Color:</strong>
        <span
          className="inline-block w-6 h-6 ml-2 border border-gray-300"
          style={{ backgroundColor: device.color }}
        />
      </div>
      <div className="mb-2">
        <strong>Min:</strong> {device.min}
      </div>
      <div className="mb-2">
        <strong>Max:</strong> {device.max}
      </div>
      <div className="mb-2">
        <strong>Tolerance:</strong> {device.tolerance}
      </div>
    </div>
  );
}

export default DeviceDetail;
