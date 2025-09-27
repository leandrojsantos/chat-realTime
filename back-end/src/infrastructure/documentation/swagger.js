const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat API',
      version: '2.0.0',
      description: `
        API para sistema de chat em tempo real desenvolvida com Clean Architecture.
        
        ## Funcionalidades
        
        - ✅ Criação e gerenciamento de usuários
        - ✅ Criação e gerenciamento de salas de chat
        - ✅ Envio e recebimento de mensagens em tempo real
        - ✅ WebSocket para comunicação em tempo real
        - ✅ Autenticação JWT
        - ✅ Rate limiting
        - ✅ Logging e auditoria
        - ✅ Health checks
        
        ## Tecnologias
        
        - **Backend**: Node.js 20, Express.js, Socket.IO
        - **Banco de Dados**: MongoDB 7.0
        - **Cache**: Redis 7.2
        - **Autenticação**: JWT
        - **Documentação**: Swagger/OpenAPI 3.0
        - **Testes**: Jest, Supertest
        - **Containerização**: Docker, Podman Compose
        
        ## Arquitetura
        
        O projeto segue os princípios de Clean Architecture/DDD:
        
        - **Domain**: Entidades, casos de uso e interfaces
        - **Infrastructure**: Repositórios, banco de dados, cache
        - **Presentation**: Controllers, rotas, middlewares
        - **Application**: Configuração e inicialização
      `,
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@chat.com',
        url: 'https://github.com/chat-realTime',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Servidor de desenvolvimento',
      },
      {
        url: 'https://api.chat.com',
        description: 'Servidor de produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            details: {
              type: 'string',
              description: 'Detalhes adicionais do erro',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro de validação',
            },
            field: {
              type: 'string',
              description: 'Campo que falhou na validação',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
              description: 'Número de itens por página',
            },
            offset: {
              type: 'integer',
              minimum: 0,
              default: 0,
              description: 'Número de itens a pular',
            },
            total: {
              type: 'integer',
              description: 'Total de itens disponíveis',
            },
          },
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Status geral da aplicação',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da verificação',
            },
            uptime: {
              type: 'number',
              description: 'Tempo de funcionamento em segundos',
            },
            memory: {
              type: 'object',
              description: 'Informações de memória',
            },
            services: {
              type: 'object',
              properties: {
                database: {
                  type: 'object',
                  properties: {
                    isConnected: {
                      type: 'boolean',
                    },
                    readyState: {
                      type: 'integer',
                    },
                  },
                },
                redis: {
                  type: 'object',
                  properties: {
                    isConnected: {
                      type: 'boolean',
                    },
                    status: {
                      type: 'string',
                    },
                  },
                },
                websocket: {
                  type: 'object',
                  properties: {
                    connectedUsers: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acesso necessário',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        ConflictError: {
          description: 'Conflito (recurso já existe)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        TooManyRequestsError: {
          description: 'Muitas requisições',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de health check e monitoramento',
      },
      {
        name: 'Users',
        description: 'Gerenciamento de usuários',
      },
      {
        name: 'Rooms',
        description: 'Gerenciamento de salas de chat',
      },
      {
        name: 'Chat',
        description: 'Mensagens e comunicação em tempo real',
      },
      {
        name: 'WebSocket',
        description: 'Eventos de WebSocket para comunicação em tempo real',
      },
    ],
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/domain/entities/*.js',
  ],
};

const specs = swaggerJsdoc(options);

// Adicionar informações de WebSocket
specs.paths['/socket.io/'] = {
  get: {
    tags: ['WebSocket'],
    summary: 'Conexão WebSocket',
    description: `
      Estabelece conexão WebSocket para comunicação em tempo real.
      
      ## Eventos disponíveis:
      
      ### Cliente → Servidor
      - \`join_room\`: Entrar em uma sala
      - \`send_message\`: Enviar mensagem
      - \`typing\`: Indicar que está digitando
      - \`disconnect\`: Desconectar
      
      ### Servidor → Cliente
      - \`receive_message\`: Receber nova mensagem
      - \`user_joined\`: Usuário entrou na sala
      - \`user_left\`: Usuário saiu da sala
      - \`user_typing\`: Usuário está digitando
      - \`room_history\`: Histórico da sala
      - \`error\`: Erro na conexão
    `,
    parameters: [
      {
        name: 'token',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Token JWT para autenticação',
      },
    ],
    responses: {
      200: {
        description: 'Conexão WebSocket estabelecida',
      },
      401: {
        description: 'Token inválido',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

module.exports = {
  swaggerSpecs: specs,
  swaggerUiOptions: {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Chat API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  },
};
