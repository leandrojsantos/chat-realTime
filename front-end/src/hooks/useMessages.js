import { useState, useEffect } from 'react';

const useMessages = (socket) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleUserJoined = (data) => {
      setMessages(prev => [...prev, {
        message: `${data.username} entrou na sala`,
        type: 'system',
        author: 'System'
      }]);
    };

    const handleUserLeft = (data) => {
      setMessages(prev => [...prev, {
        message: `${data.username} saiu da sala`,
        type: 'system',
        author: 'System'
      }]);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
    };
  }, [socket]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  return { messages, addMessage };
};

export default useMessages;
