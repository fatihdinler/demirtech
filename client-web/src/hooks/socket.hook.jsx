import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Gerekirse URL'i güncelleyin

function useRealtimeDeviceData() {
  const [realtimeDataMap, setRealtimeDataMap] = useState({}); // { [deviceId]: { ...data } }

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    socket.on('device-data', (data) => {
      // data: { deviceId, chipId, value, type, occurredTime }
      setRealtimeDataMap(prev => ({
        ...prev,
        [data.deviceId]: data,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return realtimeDataMap;
}

export default useRealtimeDeviceData;
