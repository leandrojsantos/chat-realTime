# Yarn Configuration

Este projeto usa **Yarn 4+** como gerenciador de pacotes.

## 🚀 Instalação do Yarn

### Instalação Global
```bash
# Via Corepack (Recomendado)
corepack enable
corepack prepare yarn@stable --activate

# Via npm
npm install -g yarn

# Via Homebrew (macOS)
brew install yarn
```

## 📦 Comandos Principais

### Instalação
```bash
# Instalar dependências
yarn install

# Instalação limpa (CI/CD)
yarn install --frozen-lockfile

# Instalar dependência
yarn add <package>

# Instalar dev dependency
yarn add -D <package>
```

### Scripts
```bash
# Executar script
yarn <script>

# Exemplos
yarn dev
yarn test
yarn build
yarn lint
```

### Atualização
```bash
# Atualizar dependências
yarn upgrade

# Atualização interativa
yarn upgrade-interactive

# Verificar dependências desatualizadas
yarn outdated
```

### Auditoria
```bash
# Auditoria de segurança
yarn audit

# Corrigir vulnerabilidades
yarn audit fix
```

## 🔧 Configuração

### .yarnrc.yml
```yaml
nodeLinker: node-modules
yarnPath: .yarn/releases/yarn-4.0.2.cjs
enableGlobalCache: false
compressionLevel: mixed
enableTelemetry: false
```

### Engines
```json
{
  "engines": {
    "node": ">=20.0.0",
    "yarn": ">=4.0.0"
  }
}
```

## 🐳 Docker com Yarn

### Dockerfile Backend
```dockerfile
FROM node:20-alpine

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy source code
COPY . .

CMD ["yarn", "start"]
```

### Dockerfile Frontend
```dockerfile
FROM node:20-alpine AS builder

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN yarn build
```

## 🚀 CI/CD com Yarn

### GitHub Actions
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'
    cache-dependency-path: 'back-end/yarn.lock'

- name: Install dependencies
  run: yarn install --frozen-lockfile

- name: Run tests
  run: yarn test
```

## 📊 Vantagens do Yarn

- **Performance**: Instalação mais rápida
- **Determinismo**: Lockfile mais confiável
- **Plugins**: Sistema de plugins extensível
- **Workspaces**: Suporte nativo a monorepos
- **Zero-Installs**: Cache global otimizado
- **Pnp**: Plug'n'Play para projetos modernos

## 🔄 Migração do npm

### Passos para Migração
1. Instalar Yarn
2. Remover `package-lock.json`
3. Executar `yarn install`
4. Atualizar scripts nos workflows
5. Atualizar Dockerfiles
6. Testar instalação e execução

### Comandos Equivalentes
| npm | Yarn |
|-----|------|
| `npm install` | `yarn install` |
| `npm run <script>` | `yarn <script>` |
| `npm install <pkg>` | `yarn add <pkg>` |
| `npm install -D <pkg>` | `yarn add -D <pkg>` |
| `npm update` | `yarn upgrade` |
| `npm audit` | `yarn audit` |
| `npm ci` | `yarn install --frozen-lockfile` |

## 🛠️ Troubleshooting

### Problemas Comuns
```bash
# Limpar cache
yarn cache clean

# Verificar integridade
yarn install --check-files

# Reinstalar dependências
rm -rf node_modules yarn.lock
yarn install
```

### Performance
```bash
# Habilitar cache global
yarn config set enableGlobalCache true

# Configurar compressão
yarn config set compressionLevel mixed
```
