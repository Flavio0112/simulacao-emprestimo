# Workspace da Aplicação de Empréstimo Pessoal

Aplicação completa de empréstimo pessoal com app mobile e API backend.

## Estrutura do Projeto

```
├── personal-loan-api/     # API backend Node.js/Express
├── simulation-app/        # Aplicação mobile React Native/Expo  
└── README.md              # Este arquivo
```

## Início Rápido - Instalação Manual (Recomendado)

**⚠️ IMPORTANTE**: Instale as dependências em cada pasta separadamente para evitar conflitos de dependências.

### 1. Configuração da API
```bash
# Entrar na pasta da API
cd personal-loan-api

# Instalar dependências da API
npm install

# Construir a API
npm run build

# Iniciar em modo desenvolvimento
npm run dev
```

### 2. Configuração do App Mobile (em outro terminal)
```bash
# Entrar na pasta do app mobile
cd simulation-app

# Instalar dependências do app mobile
npm install

# Iniciar o app mobile
npm start
```

## Por Que Instalação Manual?

- **Evita conflitos**: React Native e Node.js têm dependências diferentes que podem conflitar
- **Isolamento**: Cada projeto mantém suas próprias versões de dependências
- **Desenvolvimento independente**: Você pode trabalhar em cada projeto separadamente
- **Deploy independente**: API e app mobile podem ser deployados separadamente

## Comandos por Projeto

### API (personal-loan-api/)
```bash
npm install     # Instalar dependências
npm run dev     # Desenvolvimento com hot reload (porta 3000)
npm run build   # Construir para produção
npm start       # Iniciar servidor de produção
```

### App Mobile (simulation-app/)
```bash
npm install     # Instalar dependências
npm start       # Iniciar Expo dev server
npm test        # Executar testes
npm run test:coverage  # Executar testes com cobertura
```

## Integração da API

### Usando API Mock (Padrão)
O app mobile roda com dados mock por padrão. Não requer backend.

### Usando API Real
1. **Iniciar a API** (em um terminal):
   ```bash
   cd personal-loan-api
   npm run dev
   ```

2. **Configurar o app mobile** (em outro terminal):
   ```bash
   cd simulation-app
   # Editar constants/Api.ts e mudar USE_MOCK_API para false
   npm start
   ```

## Endpoints da API

O backend fornece estes endpoints:

- **GET** `/api/produtos` - Listar produtos de empréstimo
- **POST** `/api/produtos` - Criar produto de empréstimo
- **POST** `/api/simulacoes` - Realizar simulação de empréstimo
- **GET** `/api/health` - Verificação de saúde

## Funcionalidades do App Mobile

- ✅ Listagem e criação de produtos
- ✅ Simulação de empréstimo com tabela de amortização
- ✅ Formatação e validação de moeda
- ✅ Design responsivo com componentes customizados
- ✅ 100% de cobertura de testes para serviços
- ✅ TypeScript para segurança de tipos

## Funcionalidades do Backend

- ✅ Armazenamento em memória com arrays
- ✅ Toda lógica de negócio nos controllers
- ✅ CORS habilitado para o app mobile
- ✅ Validação de requisições e tratamento de erros
- ✅ Lógica de cálculo compartilhada com o app mobile
- ✅ TypeScript para segurança de tipos

## Arquitetura

### Stack do App Mobile
- **Framework**: React Native + Expo
- **Linguagem**: TypeScript
- **Navegação**: Expo Router
- **Estilização**: React Native StyleSheet
- **Testes**: Jest + React Native Testing Library

### Stack do Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Armazenamento**: Arrays em memória
- **Testes**: Não implementado (API é simples)

## Fluxo de Desenvolvimento

1. **Terminal 1 - API**:
   ```bash
   cd personal-loan-api
   npm install
   npm run dev
   ```

2. **Terminal 2 - App Mobile**:
   ```bash
   cd simulation-app  
   npm install
   npm start
   ```

3. **Fazer Alterações**: Editar código do app mobile ou API
4. **Testar Mobile**: `cd simulation-app && npm test`
5. **Trocar para API Real**: Definir `USE_MOCK_API: false` no app mobile
6. **Testar Integração**: Verificar se o app mobile funciona com a API real

## Notas de Deploy

- **App Mobile**: Usar serviço de build do Expo ou EAS Build
- **API**: Pode ser deployada em qualquer hosting Node.js (Heroku, Vercel, AWS, etc.)
- **Ambiente**: Atualizar URL base da API para produção no app mobile

## Solução de Problemas

### Problemas de Conexão com a API
- Garantir que a API está rodando na porta 3000
- Verificar configuração CORS em `simulation-app/src/middleware/cors.ts`
- Verificar se o app mobile está usando a URL correta da API

### Problemas de Build
- **Limpar dependências**:
  ```bash
  # Para a API
  cd personal-loan-api && rm -rf node_modules package-lock.json && npm install
  
  # Para o app mobile  
  cd simulation-app && rm -rf node_modules package-lock.json && npm install
  ```
- Garantir versão do Node.js >= 18.0.0
- Verificar compilação TypeScript: `cd personal-loan-api && npm run build`

### Problemas de Teste
- Testes executam apenas para o app mobile (API usa lógica simples em memória)
- **Executar testes**: `cd simulation-app && npm test`
- **Cobertura**: `cd simulation-app && npm run test:coverage`
- Testes do app mobile fazem mock do cliente HTTP para isolamento

## Vantagens da Instalação Manual

✅ **Isolamento completo** - Cada projeto tem suas próprias dependências  
✅ **Sem conflitos** - React Native e Node.js não interferem entre si  
✅ **Desenvolvimento independente** - Trabalhe em um projeto sem afetar o outro  
✅ **Deploy separado** - API e app podem ser deployados independentemente  
✅ **Debugging mais fácil** - Problemas ficam isolados em cada projeto  
✅ **Versioning limpo** - Cada projeto pode ter suas próprias versões de libs