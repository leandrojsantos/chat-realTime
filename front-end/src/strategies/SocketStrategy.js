// Strategy Pattern for Socket Connection Handling
class SocketStrategy {
  constructor() {
    if (this.constructor === SocketStrategy) {
      throw new Error("Abstract class cannot be instantiated");
    }
  }

  connect(socket, config) {
    throw new Error("Method 'connect' must be implemented");
  }

  disconnect(socket) {
    throw new Error("Method 'disconnect' must be implemented");
  }

  handleError(error) {
    throw new Error("Method 'handleError' must be implemented");
  }

  handleReconnect(attemptNumber) {
    throw new Error("Method 'handleReconnect' must be implemented");
  }
}

// Concrete Strategy for Development Environment
export class DevelopmentSocketStrategy extends SocketStrategy {
  connect(socket, config) {
    const defaultConfig = {
      url: 'http://localhost:3001',
      options: {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    console.log('🔌 Connecting to development server:', finalConfig.url);
    
    return socket.connect(finalConfig.url, finalConfig.options);
  }

  disconnect(socket) {
    console.log('🔌 Disconnecting from development server');
    socket.disconnect();
  }

  handleError(error) {
    console.error('🚨 Development Socket Error:', error);
    return {
      type: 'error',
      message: 'Connection error in development mode',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }

  handleReconnect(attemptNumber) {
    console.log(`🔄 Reconnection attempt ${attemptNumber} in development mode`);
    return {
      type: 'reconnect',
      attempt: attemptNumber,
      message: `Reconnecting... (attempt ${attemptNumber})`,
      timestamp: new Date().toISOString()
    };
  }
}

// Concrete Strategy for Production Environment
export class ProductionSocketStrategy extends SocketStrategy {
  connect(socket, config) {
    const defaultConfig = {
      url: process.env.REACT_APP_SOCKET_URL || 'wss://your-production-url.com',
      options: {
        transports: ['websocket'],
        timeout: 10000,
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    console.log('🔌 Connecting to production server');
    
    return socket.connect(finalConfig.url, finalConfig.options);
  }

  disconnect(socket) {
    console.log('🔌 Disconnecting from production server');
    socket.disconnect();
  }

  handleError(error) {
    console.error('🚨 Production Socket Error:', error);
    
    // In production, we might want to send errors to a monitoring service
    if (window.gtag) {
      window.gtag('event', 'socket_error', {
        error_message: error.message,
        error_type: error.type || 'unknown'
      });
    }
    
    return {
      type: 'error',
      message: 'Connection lost. Attempting to reconnect...',
      error: 'Connection error',
      timestamp: new Date().toISOString()
    };
  }

  handleReconnect(attemptNumber) {
    console.log(`🔄 Reconnection attempt ${attemptNumber} in production mode`);
    
    return {
      type: 'reconnect',
      attempt: attemptNumber,
      message: `Reconnecting... (${attemptNumber}/5)`,
      timestamp: new Date().toISOString()
    };
  }
}

// Concrete Strategy for Testing Environment
export class TestingSocketStrategy extends SocketStrategy {
  connect(socket, config) {
    const defaultConfig = {
      url: 'http://localhost:3001',
      options: {
        transports: ['polling'],
        timeout: 2000,
        forceNew: true,
        autoConnect: false
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    console.log('🧪 Connecting to test server:', finalConfig.url);
    
    return socket.connect(finalConfig.url, finalConfig.options);
  }

  disconnect(socket) {
    console.log('🧪 Disconnecting from test server');
    socket.disconnect();
  }

  handleError(error) {
    console.error('🧪 Test Socket Error:', error);
    return {
      type: 'error',
      message: 'Test connection error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }

  handleReconnect(attemptNumber) {
    console.log(`🧪 Test reconnection attempt ${attemptNumber}`);
    return {
      type: 'reconnect',
      attempt: attemptNumber,
      message: `Test reconnecting... (attempt ${attemptNumber})`,
      timestamp: new Date().toISOString()
    };
  }
}

// Context Class that uses the Socket Strategy
export class SocketManager {
  constructor(strategy) {
    this.strategy = strategy;
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  setStrategy(strategy) {
    if (!(strategy instanceof SocketStrategy)) {
      throw new Error("Strategy must extend SocketStrategy");
    }
    this.strategy = strategy;
  }

  connect(config = {}) {
    if (!this.socket) {
      throw new Error("Socket not initialized");
    }

    try {
      this.strategy.connect(this.socket, config);
      this.isConnected = true;
      return true;
    } catch (error) {
      this.isConnected = false;
      return this.strategy.handleError(error);
    }
  }

  disconnect() {
    if (this.socket && this.isConnected) {
      this.strategy.disconnect(this.socket);
      this.isConnected = false;
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  handleReconnect(attemptNumber) {
    return this.strategy.handleReconnect(attemptNumber);
  }
}

// Factory for creating socket managers
export class SocketManagerFactory {
  static createForEnvironment(environment = 'development') {
    let strategy;
    
    switch (environment) {
      case 'production':
        strategy = new ProductionSocketStrategy();
        break;
      case 'testing':
        strategy = new TestingSocketStrategy();
        break;
      case 'development':
      default:
        strategy = new DevelopmentSocketStrategy();
        break;
    }
    
    return new SocketManager(strategy);
  }

  static createWithStrategy(strategy) {
    return new SocketManager(strategy);
  }
}
