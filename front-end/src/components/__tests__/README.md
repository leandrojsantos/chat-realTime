# Testes dos Componentes

Este diretório contém os testes específicos para os componentes do frontend.

## Componentes Testados

### Chat Component (`chatComponent.test.js`)
Testa o componente principal de chat em tempo real.

#### Funcionalidades Testadas
- **Renderização**: Estrutura inicial do chat
- **Mensagens**: Envio e recebimento de mensagens
- **Digitação**: Indicadores de digitação em tempo real
- **Socket.IO**: Integração com WebSocket
- **Navegação**: Botão de voltar
- **Acessibilidade**: Labels e estrutura semântica

#### Casos de Teste
1. **Renderização Inicial**
   - Exibe título e sala
   - Mostra campo de entrada
   - Botão de enviar desabilitado
   - Botão de voltar

2. **Envio de Mensagens**
   - Envio via botão
   - Envio via Enter
   - Validação de mensagem vazia
   - Limpeza do campo após envio

3. **Funcionalidade de Digitação**
   - Emissão de evento ao digitar
   - Parada automática após 1 segundo
   - Indicadores visuais

4. **Recebimento de Mensagens**
   - Exibição de mensagens recebidas
   - Diferentes tipos de mensagem
   - Indicadores de digitação

5. **Navegação**
   - Botão de voltar funcional
   - Callback para página inicial

6. **Acessibilidade**
   - Labels ARIA apropriados
   - Limite de caracteres
   - Estrutura semântica

## Mock e Simulações

### Socket.IO Client
```javascript
const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockClose = jest.fn();

jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    emit: mockEmit,
    on: mockOn,
    close: mockClose,
  }));
});
```

### Eventos Socket.IO Testados
- `send_message`: Envio de mensagens
- `typing`: Indicador de digitação
- `stop_typing`: Parada de digitação
- `receive_message`: Recebimento de mensagens
- `user_joined`: Usuário entrou na sala
- `user_left`: Usuário saiu da sala

## Estrutura dos Testes

### Organização por Funcionalidade
```javascript
describe('Componente Chat', () => {
  describe('Renderização inicial', () => {
    // Testes de renderização
  });
  
  describe('Funcionalidade de mensagens', () => {
    // Testes de envio/recebimento
  });
  
  describe('Funcionalidade de digitação', () => {
    // Testes de indicadores
  });
  
  describe('Recebimento de mensagens', () => {
    // Testes de eventos Socket.IO
  });
  
  describe('Navegação', () => {
    // Testes de navegação
  });
  
  describe('Acessibilidade', () => {
    // Testes de acessibilidade
  });
});
```

### Padrões de Teste
- **Arrange**: Configurar mocks e estado inicial
- **Act**: Executar ação do usuário
- **Assert**: Verificar resultado esperado

### Exemplo de Teste
```javascript
test('deve enviar mensagem quando clicar no botão', async () => {
  // Arrange
  render(<Chat onBackToHome={mockOnBackToHome} />);
  const messageInput = screen.getByPlaceholderText('Digite sua mensagem...');
  const sendButton = screen.getByRole('button', { name: /enviar mensagem/i });
  
  // Act
  fireEvent.change(messageInput, { target: { value: 'Olá pessoal!' } });
  fireEvent.click(sendButton);
  
  // Assert
  expect(mockEmit).toHaveBeenCalledWith('send_message', {
    message: 'Olá pessoal!',
    author: 'Você',
    room: 'general'
  });
});
```

## Cobertura de Testes

**Status Atual: 5/5 testes passando (100%)**

### Funcionalidades Cobertas
- ✅ Renderização inicial
- ✅ Estrutura semântica
- ✅ Navegação (botão voltar)
- ✅ Acessibilidade
- ✅ Validação de entrada (limite de caracteres)
- ✅ Integração Socket.IO (mock)

### Casos Extremos
- ✅ Mensagem vazia
- ✅ Campo de entrada limpo
- ✅ Timeout de digitação
- ✅ Múltiplos usuários digitando
- ✅ Diferentes tipos de mensagem

## Manutenção

### Quando Atualizar os Testes
- Adicionar novas funcionalidades ao chat
- Modificar interface do usuário
- Alterar integração com Socket.IO
- Adicionar novos tipos de mensagem
- Modificar validações

### Boas Práticas
- Manter mocks atualizados
- Testar casos extremos
- Verificar acessibilidade
- Testar integração com Socket.IO
- Validar comportamento responsivo
