/**
 * Testes simplificados para o componente Chat
 * Foca na renderização e funcionalidades básicas sem dependência de hooks customizados
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock do socket.io-client diretamente
const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockClose = jest.fn();

jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    emit: mockEmit,
    on: mockOn,
    off: mockOff,
    close: mockClose,
    connected: true,
    id: 'mock-socket-id',
    disconnect: mockClose,
  }));
});

// Importar componente após os mocks
import Chat from '../chatComponent';

describe('Componente Chat - Testes Simplificados', () => {
  const mockOnBackToHome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar elementos básicos do chat', async () => {
    await act(async () => {
      render(<Chat onBackToHome={mockOnBackToHome} />);
    });
    
    // Verificar elementos principais
    expect(screen.getByText('💬 Chat RealTime')).toBeInTheDocument();
    expect(screen.getByText('Sala: general')).toBeInTheDocument();
    expect(screen.getByText('← Voltar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua mensagem...')).toBeInTheDocument();
  });

  test('deve ter estrutura semântica apropriada', async () => {
    await act(async () => {
      render(<Chat onBackToHome={mockOnBackToHome} />);
    });
    
    // Verificar roles ARIA básicos
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('botão de voltar deve funcionar', async () => {
    await act(async () => {
      render(<Chat onBackToHome={mockOnBackToHome} />);
    });
    
    const backButton = screen.getByText('← Voltar');
    
    await act(async () => {
      fireEvent.click(backButton);
    });
    
    expect(mockOnBackToHome).toHaveBeenCalledTimes(1);
  });

  test('campo de entrada deve ter limite de caracteres', async () => {
    await act(async () => {
      render(<Chat onBackToHome={mockOnBackToHome} />);
    });
    
    const messageInput = screen.getByPlaceholderText('Digite sua mensagem...');
    expect(messageInput).toHaveAttribute('maxLength', '500');
  });

  test('deve ter labels de acessibilidade apropriados', async () => {
    await act(async () => {
      render(<Chat onBackToHome={mockOnBackToHome} />);
    });
    
    // Verificar labels ARIA
    expect(screen.getByLabelText(/campo de entrada de mensagem/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enviar mensagem/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/voltar para a página inicial/i)).toBeInTheDocument();
  });
});
