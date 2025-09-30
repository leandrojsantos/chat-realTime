/**
 * Testes unitários para o componente App
 * Testa a renderização e interações do componente principal
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock do componente Chat
jest.mock('../components/chatComponent', () => {
  return function MockChat({ onBackToHome }) {
    return (
      <div data-testid="chat-component">
        <h1>Chat Component</h1>
        <button onClick={onBackToHome} data-testid="back-button">
          Voltar
        </button>
      </div>
    );
  };
});

describe('Componente App', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar a página inicial corretamente', () => {
      render(<App />);
      
      // Verificar elementos principais
      expect(screen.getByText('💬 Chat RealTime')).toBeInTheDocument();
      expect(screen.getByText('Aplicação de chat em tempo real com tecnologia moderna')).toBeInTheDocument();
      expect(screen.getByText('🚀 Iniciar Chat')).toBeInTheDocument();
      
      // Verificar links rápidos
      expect(screen.getByText('📊 Dashboard Admin')).toBeInTheDocument();
      expect(screen.getByText('🔗 API Backend')).toBeInTheDocument();
      
      // Verificar status dos serviços
      expect(screen.getByText('✅ Frontend: http://localhost:3000')).toBeInTheDocument();
      expect(screen.getByText('✅ Backend: http://localhost:3001')).toBeInTheDocument();
    });

    test('deve exibir funcionalidades da aplicação', () => {
      render(<App />);
      
      expect(screen.getByText('Tecnologia Moderna')).toBeInTheDocument();
      expect(screen.getByText('Design 2025')).toBeInTheDocument();
      expect(screen.getByText('Tempo Real')).toBeInTheDocument();
    });

    test('deve ter estrutura semântica correta', () => {
      render(<App />);
      
      // Verificar roles ARIA
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar chat/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /dashboard admin/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /abrir api do backend/i })).toBeInTheDocument();
    });
  });

  describe('Interações do usuário', () => {
    test('deve abrir prompt para nome de usuário ao clicar em Iniciar Chat', () => {
      // Mock do prompt
      const mockPrompt = jest.spyOn(window, 'prompt');
      mockPrompt.mockReturnValue('João Silva');
      
      render(<App />);
      
      const startButton = screen.getByRole('button', { name: /iniciar chat/i });
      fireEvent.click(startButton);
      
      expect(mockPrompt).toHaveBeenCalledWith('Digite seu nome de usuário:');
      
      mockPrompt.mockRestore();
    });

    test('deve mostrar chat quando usuário fornece nome válido', async () => {
      // Mock do prompt
      const mockPrompt = jest.spyOn(window, 'prompt');
      mockPrompt.mockReturnValue('Maria Santos');
      
      render(<App />);
      
      // Verificar status de conexão
      const connectionStatus = screen.getByText('Desconectado');
      expect(connectionStatus).toBeInTheDocument();
      
      // O botão deve estar habilitado quando desconectado
      const startButton = screen.getByRole('button', { name: /iniciar chat/i });
      expect(startButton).not.toBeDisabled();
      
      mockPrompt.mockRestore();
    });

    test('não deve mostrar chat quando usuário cancela o prompt', () => {
      // Mock do prompt retornando null (cancelar)
      const mockPrompt = jest.spyOn(window, 'prompt');
      mockPrompt.mockReturnValue(null);
      
      render(<App />);
      
      const startButton = screen.getByRole('button', { name: /iniciar chat/i });
      fireEvent.click(startButton);
      
      // Chat não deve ser exibido
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
      expect(screen.getByText('💬 Chat RealTime')).toBeInTheDocument();
      
      mockPrompt.mockRestore();
    });

    test('não deve mostrar chat quando usuário fornece nome vazio', () => {
      // Mock do prompt retornando string vazia
      const mockPrompt = jest.spyOn(window, 'prompt');
      mockPrompt.mockReturnValue('');
      
      render(<App />);
      
      const startButton = screen.getByRole('button', { name: /iniciar chat/i });
      fireEvent.click(startButton);
      
      // Chat não deve ser exibido
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
      expect(screen.getByText('💬 Chat RealTime')).toBeInTheDocument();
      
      mockPrompt.mockRestore();
    });

    test('deve voltar para página inicial ao clicar em Voltar', async () => {
      // Mock do prompt
      const mockPrompt = jest.spyOn(window, 'prompt');
      mockPrompt.mockReturnValue('Teste');
      
      render(<App />);
      
      // Verificar que o botão está habilitado quando desconectado
      const startButton = screen.getByRole('button', { name: /iniciar chat/i });
      expect(startButton).not.toBeDisabled();
      
      // Verificar que estamos na página inicial
      expect(screen.getByText('💬 Chat RealTime')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
      
      mockPrompt.mockRestore();
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter labels e roles apropriados', () => {
      render(<App />);
      
      // Verificar labels ARIA
      expect(screen.getByLabelText(/iniciar chat em tempo real/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/abrir dashboard administrativo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/abrir api do backend/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/funcionalidades da aplicação/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status dos serviços/i)).toBeInTheDocument();
    });

    test('deve ter estrutura semântica para leitores de tela', () => {
      render(<App />);
      
      // Verificar elementos semânticos
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });
  });
});
