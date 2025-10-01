import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './components/chatComponent';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const joinRoom = (data) => {
    const newSocket = io('http://localhost:3001');
    if (newSocket) {
      setConnectionStatus('connected');
      setSocket(newSocket);
      setShowChat(true);
      newSocket.emit('join_room', data);
    } else {
      setConnectionStatus('error');
    }
  };

  const handleStartChat = () => {
    const username = prompt('Digite seu nome de usuário:');
    if (username && username.trim() !== '') {
      joinRoom({ username: username.trim() });
    }
  };

  const handleBackToHome = () => {
    if (socket) {
      socket.disconnect();
    }
    setShowChat(false);
    setConnectionStatus('disconnected');
    setSocket(null);
  };

  // Se estamos na página inicial, mostrar a página de boas-vindas
  if (!showChat) {
    return (
      <div className="App">
        <main role="main">
          <div className="joinChatContainer">
            <div className="connection-status">
              <div className={`status-indicator ${connectionStatus}`}>
                <div className="status-dot"></div>
                <span className="status-text">
                  {connectionStatus === 'connected' ? 'Conectado' : 
                   connectionStatus === 'error' ? 'Erro de conexão' : 'Desconectado'}
                </span>
              </div>
            </div>
            
            <h1>💬 Chat RealTime</h1>
            <p className="subtitle">Aplicação de chat em tempo real com tecnologia moderna</p>
            
            <section className="features-preview" aria-label="Funcionalidades da aplicação">
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">🚀</span>
                <span>Tecnologia Moderna</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">🎨</span>
                <span>Design 2025</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">⚡</span>
                <span>Tempo Real</span>
              </div>
            </section>

            <button 
              type="button"
              className="joinChatButton" 
              onClick={handleStartChat}
              disabled={connectionStatus === 'error'}
              aria-label="Iniciar chat em tempo real"
            >
              🚀 Iniciar Chat
            </button>

            <nav className="quick-links" aria-label="Links rápidos">
              <a 
                href="http://localhost:3001/admin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="quick-link"
                aria-label="Abrir dashboard administrativo em nova aba"
              >
                📊 Dashboard Admin
              </a>
              <a 
                href="http://localhost:3001/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="quick-link"
                aria-label="Abrir API do backend em nova aba"
              >
                🔗 API Backend
              </a>
            </nav>

            <section className="status-info" aria-label="Status dos serviços">
              <p>✅ Frontend: http://localhost:3000</p>
              <p>✅ Backend: http://localhost:3001</p>
              <p>✅ MongoDB: localhost:27017</p>
              <p>✅ Redis: localhost:6379</p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // Se estamos no chat, mostrar o componente de chat
  return (
    <div className="App">
      <Chat 
        socket={socket} 
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}

export default App;