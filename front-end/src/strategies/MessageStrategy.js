// Strategy Pattern for Message Handling
class MessageStrategy {
  constructor() {
    if (this.constructor === MessageStrategy) {
      throw new Error("Abstract class cannot be instantiated");
    }
  }

  processMessage(messageData) {
    throw new Error("Method 'processMessage' must be implemented");
  }

  validateMessage(messageData) {
    throw new Error("Method 'validateMessage' must be implemented");
  }

  formatMessage(messageData) {
    throw new Error("Method 'formatMessage' must be implemented");
  }
}

// Concrete Strategy for Text Messages
export class TextMessageStrategy extends MessageStrategy {
  processMessage(messageData) {
    if (!this.validateMessage(messageData)) {
      throw new Error("Invalid text message");
    }
    
    return this.formatMessage(messageData);
  }

  validateMessage(messageData) {
    return (
      messageData.message &&
      typeof messageData.message === 'string' &&
      messageData.message.trim().length > 0 &&
      messageData.message.length <= 1000
    );
  }

  formatMessage(messageData) {
    return {
      ...messageData,
      type: 'text',
      timestamp: new Date().toISOString(),
      processedAt: Date.now()
    };
  }
}

// Concrete Strategy for System Messages
export class SystemMessageStrategy extends MessageStrategy {
  processMessage(messageData) {
    if (!this.validateMessage(messageData)) {
      throw new Error("Invalid system message");
    }
    
    return this.formatMessage(messageData);
  }

  validateMessage(messageData) {
    return (
      messageData.message &&
      typeof messageData.message === 'string' &&
      messageData.systemType &&
      ['join', 'leave', 'error', 'info'].includes(messageData.systemType)
    );
  }

  formatMessage(messageData) {
    return {
      ...messageData,
      type: 'system',
      timestamp: new Date().toISOString(),
      processedAt: Date.now(),
      author: 'System'
    };
  }
}

// Concrete Strategy for Media Messages
export class MediaMessageStrategy extends MessageStrategy {
  processMessage(messageData) {
    if (!this.validateMessage(messageData)) {
      throw new Error("Invalid media message");
    }
    
    return this.formatMessage(messageData);
  }

  validateMessage(messageData) {
    return (
      messageData.mediaUrl &&
      typeof messageData.mediaUrl === 'string' &&
      messageData.mediaType &&
      ['image', 'video', 'audio', 'file'].includes(messageData.mediaType)
    );
  }

  formatMessage(messageData) {
    return {
      ...messageData,
      type: 'media',
      timestamp: new Date().toISOString(),
      processedAt: Date.now()
    };
  }
}

// Context Class that uses the Strategy
export class MessageProcessor {
  constructor() {
    this.strategies = new Map();
    this.defaultStrategy = new TextMessageStrategy();
  }

  registerStrategy(type, strategy) {
    if (!(strategy instanceof MessageStrategy)) {
      throw new Error("Strategy must extend MessageStrategy");
    }
    this.strategies.set(type, strategy);
  }

  processMessage(messageData) {
    const strategy = this.strategies.get(messageData.type) || this.defaultStrategy;
    return strategy.processMessage(messageData);
  }

  getAvailableTypes() {
    return Array.from(this.strategies.keys());
  }
}

// Factory for creating message processors
export class MessageProcessorFactory {
  static createDefaultProcessor() {
    const processor = new MessageProcessor();
    
    // Register default strategies
    processor.registerStrategy('text', new TextMessageStrategy());
    processor.registerStrategy('system', new SystemMessageStrategy());
    processor.registerStrategy('media', new MediaMessageStrategy());
    
    return processor;
  }

  static createCustomProcessor(strategies) {
    const processor = new MessageProcessor();
    
    Object.entries(strategies).forEach(([type, strategy]) => {
      processor.registerStrategy(type, strategy);
    });
    
    return processor;
  }
}
