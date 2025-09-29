import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      if (newSocket && typeof newSocket.close === 'function') {
        newSocket.close();
      }
    };
  }, [url]);

  return socket;
};

export default useSocket;
