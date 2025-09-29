import { useState, useEffect } from 'react';

const useTyping = (socket) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data) => {
      setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username]);
    };

    const handleStopTyping = (data) => {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    };

    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket]);

  const startTyping = (username) => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing', { room: 'general', username });
    }
  };

  const stopTyping = (username) => {
    setIsTyping(false);
    socket?.emit('stop_typing', { room: 'general', username });
  };

  return { typingUsers, isTyping, startTyping, stopTyping };
};

export default useTyping;
