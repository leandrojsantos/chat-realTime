import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

function Chat({ socket, onBackToHome }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [username] = useState('Usuário');
  const [room] = useState('general');

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      try {
        const messageData = {
          message: currentMessage.trim(),
          author: username,
          room: room,
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

        socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        
        // Stop typing indicator
        socket.emit('stop_typing', { room, username });
        setIsTyping(false);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      }
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { room, username });
    }
    
    // Clear typing timeout
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { room, username });
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Message listeners
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const handleTyping = (data) => {
      if (data.username !== username) {
        setTypingUsers(prev => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      }
    };

    const handleStopTyping = (data) => {
      if (data.username !== username) {
        setTypingUsers(prev => prev.filter(user => user !== data.username));
      }
    };

    const handleUserJoined = (data) => {
      try {
        const systemMessage = messageProcessor ? messageProcessor.processMessage({
          type: 'system',
          systemType: 'join',
          message: `${data.username} entrou na sala`,
          room: room,
          author: 'System',
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }) : {
          type: 'system',
          message: `${data.username} entrou na sala`,
          room: room,
          author: 'System',
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessageList((list) => [...list, systemMessage]);
      } catch (error) {
        console.error("Error processing join message:", error);
      }
    };

    const handleUserLeft = (data) => {
      try {
        const systemMessage = messageProcessor ? messageProcessor.processMessage({
          type: 'system',
          systemType: 'leave',
          message: `${data.username} saiu da sala`,
          room: room,
          author: 'System',
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }) : {
          type: 'system',
          message: `${data.username} saiu da sala`,
          room: room,
          author: 'System',
          time: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessageList((list) => [...list, systemMessage]);
      } catch (error) {
        console.error("Error processing leave message:", error);
      }
    };

    // Add event listeners
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);

    // Cleanup on unmount
    return () => {
      if (socketManager) {
        socketManager.removeEventListener('receive_message', handleReceiveMessage);
        socketManager.removeEventListener('typing', handleTyping);
        socketManager.removeEventListener('stop_typing', handleStopTyping);
        socketManager.removeEventListener('user_joined', handleUserJoined);
        socketManager.removeEventListener('user_left', handleUserLeft);
      } else if (socket) {
        socket.off('receive_message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('stop_typing', handleStopTyping);
        socket.off('user_joined', handleUserJoined);
        socket.off('user_left', handleUserLeft);
      }
      
      // Clear typing timeout
      if (window.typingTimeout) {
        clearTimeout(window.typingTimeout);
      }
    };
  }, [socket, username, room]);

  return (
    <div className="chat-window" role="application" aria-label="Chat em tempo real" data-testid="chat-component">
      <header className="chat-header" role="banner">
        <h1>💬 Chat RealTime</h1>
        <p>Sala: {room}</p>
        <p>👤 {username} • {messageList.length} mensagens</p>
        {typingUsers.length > 0 && (
          <p className="typing-indicator">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} está digitando...`
              : `${typingUsers.length} usuários estão digitando...`
            }
          </p>
        )}
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
          {messageList.map((messageContent, index) => {
            const isSystemMessage = messageContent.type === 'system';
            const isOwnMessage = username === messageContent.author;
            
            return (
              <div
                key={index}
                className={`message ${isSystemMessage ? 'system' : ''}`}
                id={isOwnMessage ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  {!isSystemMessage && (
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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