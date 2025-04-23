import React, { useState } from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';
import useDashboard from './dashboard.hook';
import useRealtimeDeviceData from '../../hooks/socket.hook';
import {
  FaThermometerHalf,
  FaTint,
  FaExclamationTriangle
} from 'react-icons/fa';

const DashboardDeviceSelection = ({
  selectedCustomer,
  selectedBranch,
  selectedLocation,
  onBackToLocation
}) => {
  const { devices, isDevicesLoading, errorDevices } = useDashboard();
  const realtimeDataMap = useRealtimeDeviceData();
  const [activeDevice, setActiveDevice] = useState(null);

  const getValueStatus = (type, value) => {
    const t = type.toLowerCase();
    if (t === 'temperature' || t === 'sicaklik') {
      if (value < 15 || value > 30) return 'critical';
      if (value < 17 || value > 28) return 'warning';
      return 'normal';
    }
    if (t === 'humidity' || t === 'nem') {
      if (value < 30 || value > 70) return 'warning';
      if (value < 20 || value > 80) return 'critical';
      return 'normal';
    }
    return 'normal';
  };

  const renderBreadcrumbs = () => (
    <Breadcrumb className="mb-4">
      <Breadcrumb.Item onClick={onBackToLocation}>
        Lokasyonlar
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        {selectedLocation.name}
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  const renderDeviceCard = (device) => {
    const realtime = realtimeDataMap[device.id];
    const isActive = activeDevice === device.id;

    let icon = <FaExclamationTriangle size={24} />;
    let reading = 'N/A';
    let unit = '';
    let status = 'normal';

    if (realtime) {
      const val = Number(realtime.value);
      reading = val.toFixed(2);
      if (realtime.type.toLowerCase() === 'humidity' || realtime.type.toLowerCase() === 'nem') {
        icon = <FaTint size={24} />;
        unit = '%';
      } else {
        icon = <FaThermometerHalf size={24} />;
        unit = '°C';
      }
      status = getValueStatus(realtime.type, val);
    }

    return (
      <div
        key={device.id}
        className={`device-card ${isActive ? 'active' : ''} ${status}`}
        onClick={() => setActiveDevice(device.id)}
      >
        <div className="device-header">
          <div className="device-name">{device.name}</div>
          <div className="device-icon">{icon}</div>
        </div>
        <div className="device-reading">
          <span className="reading-value">{reading}</span>
          <span className="reading-unit">{unit}</span>
        </div>
        <div className="device-description">
          {device.description || 'Açıklama bulunamadı'}
        </div>
      </div>
    );
  };

  const renderDevices = () => {
    if (isDevicesLoading)
      return <div className="loading-indicator">Cihazlar yükleniyor...</div>;
    if (errorDevices)
      return <div className="error-message">Hata: {errorDevices.message}</div>;

    const filtered = devices.filter(
      (d) => d.locationId === selectedLocation.id
    );

    return filtered.length ? (
      <div className="device-grid">
        {filtered.map(renderDeviceCard)}
      </div>
    ) : (
      <div className="empty-state">
        Seçilen lokasyon için cihaz bulunamadı.
      </div>
    );
  };

  return (
    <Container fluid className="dashboard-container">
      {renderBreadcrumbs()}
      <div className="dashboard-content">{renderDevices()}</div>

      <style jsx>{`
        .dashboard-container {
          padding: 1.5rem;
          background-color: #f8fafc;
        }

        .dashboard-content {
          padding: 1.5rem;
        }

        .device-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .device-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          height: 180px;
          display: flex;
          flex-direction: column;
        }

        .device-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .device-card.active {
          border: 2px solid #3b82f6;
        }
        .device-card.critical {
          border-left: 4px solid #ef4444;
        }
        .device-card.warning {
          border-left: 4px solid #f59e0b;
        }
        .device-card.normal {
          border-left: 4px solid #10b981;
        }

        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .device-name {
          font-weight: 600;
          font-size: 1.125rem;
          color: #1f2937;
        }

        .device-icon {
          /* no absolute positioning any more */
          opacity: 0.7;
        }

        .device-reading {
          display: flex;
          align-items: baseline;
          margin-top: auto;
          margin-bottom: 0.75rem;
        }

        .reading-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }

        .reading-unit {
          font-size: 1.25rem;
          font-weight: 500;
          color: #6b7280;
          margin-left: 0.25rem;
        }

        .device-description {
          font-size: 0.7rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .loading-indicator {
          display: flex;
          justify-content: center;
          padding: 2rem;
          color: #6b7280;
        }

        .error-message {
          color: #ef4444;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </Container>
  );
};

export default DashboardDeviceSelection;
