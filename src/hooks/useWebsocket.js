import { constants, headers } from '@/constants';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    console.log(constants.urls.notificationGateway, headers);
    const newSocket = io(constants.urls.notificationGateway, {
      transports: ['websocket'],
      auth: headers,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketConnected(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, socketConnected };
};

export default useWebSocket;
