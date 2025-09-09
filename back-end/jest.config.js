module.exports = {
  // Diretório onde os testes estão localizados
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  
  // Diretórios que devem ser ignorados
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  
  // Ambiente de teste
  testEnvironment: "node",
  
  // Configurações de cobertura
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js"
  ],
  
  // Diretório para relatórios de cobertura
  coverageDirectory: "coverage",
  
  // Arquivos de cobertura
  coverageReporters: [
    "text",
    "lcov",
    "html"
  ],
  
  // Setup de testes
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  
  // Timeout para testes
  testTimeout: 10000,
  
  // Verbose para melhor visualização
  verbose: true
};
