import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Chat({ onBackToHome }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    newSocket.on('typing', (data) => {
      setTypingUsers(prev => [...prev.filter(user => user !== data.username), data.username]);
    });

    newSocket.on('stop_typing', (data) => {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    });

    newSocket.on('user_joined', (data) => {
      setMessages(prev => [...prev, {
        message: `${data.username} entrou na sala`,
        type: 'system',
        author: 'System'
      }]);
    });

    newSocket.on('user_left', (data) => {
      setMessages(prev => [...prev, {
        message: `${data.username} saiu da sala`,
        type: 'system',
        author: 'System'
      }]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = async () => {
    if (currentMessage.trim() && socket) {
      const messageData = {
        message: currentMessage,
        author: 'Você',
        room: 'general'
      };

      socket.emit('send_message', messageData);
      setMessages(prev => [...prev, messageData]);
      setCurrentMessage('');
      
      // Stop typing
      socket.emit('stop_typing', { room: 'general', username: 'Você' });
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing', { room: 'general', username: 'Você' });
    }

    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('stop_typing', { room: 'general', username: 'Você' });
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-window" role="main" aria-label="Chat em tempo real">
      <header className="chat-header" role="banner">
        <h1>💬 Chat RealTime</h1>
        <p>Sala: General</p>
        {typingUsers.length > 0 && (
          <p className="typing-indicator" role="status" aria-live="polite">
            {typingUsers.join(', ')} está digitando...
          </p>
        )}
        <button 
          type="button"
          onClick={onBackToHome} 
          className="back-button"
          aria-label="Voltar para a página inicial"
        >
          ← Voltar
        </button>
      </header>
      
      <main className="chat-body" role="main">
        <div 
          className="message-container" 
          role="log" 
          aria-live="polite" 
          aria-label="Mensagens do chat"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.author === 'Você' ? 'you' : message.type === 'system' ? 'system' : 'other'}`}
              role="listitem"
            >
              <div className="message-content">
                <p>{message.message}</p>
              </div>
              {message.type !== 'system' && (
                <div className="message-meta">
                  <p>{message.author}</p>
                  <p>{new Date().toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <footer className="chat-footer" role="contentinfo">
        <input
          type="text"
          value={currentMessage}
          placeholder="Digite sua mensagem..."
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          maxLength={500}
          aria-label="Campo de entrada de mensagem"
        />
        <button 
          type="button"
          onClick={sendMessage} 
          disabled={!currentMessage.trim()}
          aria-label="Enviar mensagem"
        >
          <span className="send-icon" aria-hidden="true">📤</span>
        </button>
      </footer>
    </div>
  );
}

export default Chat;