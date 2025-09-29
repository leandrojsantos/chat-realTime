import React, { useState } from 'react';
import useSocket from '../hooks/useSocket';
import useMessages from '../hooks/useMessages';
import useTyping from '../hooks/useTyping';
import Button from './Button';
import Input from './Input';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

function Chat({ onBackToHome }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const socket = useSocket('http://localhost:3001');
  const { messages, addMessage } = useMessages(socket);
  const { typingUsers, isTyping, startTyping, stopTyping } = useTyping(socket);

  const sendMessage = () => {
    if (currentMessage.trim() && socket) {
      const messageData = {
        message: currentMessage,
        author: 'Você',
        room: 'general'
      };

      socket.emit('send_message', messageData);
      addMessage(messageData);
      setCurrentMessage('');
      stopTyping('Você');
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    startTyping('Você');

    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      stopTyping('Você');
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-window" role="application" aria-label="Chat em tempo real">
      <header className="chat-header" role="banner">
        <h1>💬 Chat RealTime</h1>
        <p>Sala: General</p>
        <TypingIndicator users={typingUsers} />
        <Button 
          onClick={onBackToHome} 
          className="back-button"
          ariaLabel="Voltar para a página inicial"
        >
          ← Voltar
        </Button>
      </header>
      
      <main className="chat-body" role="main">
        <div 
          className="message-container" 
          role="log" 
          aria-live="polite" 
          aria-label="Mensagens do chat"
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message.message}
              author={message.author}
              type={message.type}
            />
          ))}
        </div>
      </main>
      
      <footer className="chat-footer" role="contentinfo">
        <Input
          value={currentMessage}
          placeholder="Digite sua mensagem..."
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          maxLength={500}
          ariaLabel="Campo de entrada de mensagem"
        />
        <Button 
          onClick={sendMessage} 
          disabled={!currentMessage.trim()}
          ariaLabel="Enviar mensagem"
        >
          <span className="send-icon" aria-hidden="true">📤</span>
        </Button>
      </footer>
    </div>
  );
}

export default Chat;