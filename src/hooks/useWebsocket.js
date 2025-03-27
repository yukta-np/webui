import { constants, headers } from '@/constants';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);
  useEffect(() => {
    if (retries >= MAX_RETRIES) {
      setError('Failed to connect after multiple attempts.');
      return;
    }

    const newSocket = io(constants.urls.notificationGateway, {
      transports: ['websocket'],
      auth: headers,
      reconnection: false,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setSocketConnected(true);
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.log(`Connection attempt ${retries + 1} failed:`, err.message);
      setRetries((prevRetries) => prevRetries + 1);

      // Retry after a delay
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          setRetries(retries + 1);
        }, RETRY_DELAY);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [retries]);

  return { socket, socketConnected, error };
};

export default useWebSocket;
