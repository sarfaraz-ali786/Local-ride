import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://local-ride-production.up.railway.app';

export function useDriverNotifications(onNewBooking) {
  const socketRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'driver') return;

    socketRef.current = io(BACKEND_URL);
    socketRef.current.emit('register_driver', user.id);

    socketRef.current.on('new_booking', (data) => {
      onNewBooking(data);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);
}