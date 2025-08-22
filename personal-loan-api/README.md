# API de Empréstimos Pessoais

API backend simples para a aplicação móvel de Empréstimos Pessoais.

## Características

- **Armazenamento em memória** com persistência baseada em arrays
- **3 endpoints REST** que atendem aos requisitos da aplicação móvel
- **TypeScript** para segurança de tipos
- **Express.js** framework leve e eficiente
- **CORS habilitado** para comunicação com a aplicação móvel
- **Validação de requisições** e tratamento de erros

## Endpoints da API

### Produtos
- `GET /api/produtos` - Lista todos os produtos de empréstimo
- `POST /api/produtos` - Cria um novo produto de empréstimo

### Simulações
- `POST /api/simulacoes` - Realiza simulação de empréstimo

### Saúde
- `GET /api/health` - Endpoint de verificação de saúde

## Início Rápido

```bash
# Instalar dependências
npm install

# Modo de desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## Exemplos da API

### Obter Produtos
```bash
curl http://localhost:3000/api/produtos
```

### Criar Produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Crédito Pessoal",
    "annualInterestRate": 15.5,
    "maxTermMonths": 48
  }'
```

### Simular Empréstimo
```bash
curl -X POST http://localhost:3000/api/simulacoes \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "loanAmount": 10000,
    "termMonths": 12
  }'
```

## Produtos Padrão

A API vem pré-carregada com 3 produtos de empréstimo:

1. **Empréstimo Pessoal** - Taxa anual de 18,5%, máximo de 60 meses
2. **Crédito Consignado** - Taxa anual de 12,8%, máximo de 84 meses  
3. **Financiamento Imobiliário** - Taxa anual de 9,2%, máximo de 360 meses

## Estrutura dos Dados

### Produto de Empréstimo
```typescript
interface LoanProduct {
  id: string;
  name: string;
  annualInterestRate: number;  // Taxa de juros anual em %
  maxTermMonths: number;       // Prazo máximo em meses
}
```

### Simulação de Empréstimo
```typescript
interface LoanSimulation {
  productId: string;
  loanAmount: number;     // Valor do empréstimo
  termMonths: number;     // Prazo em meses
}

interface LoanSimulationResult {
  monthlyPayment: number;    // Prestação mensal
  totalAmount: number;       // Valor total a ser pago
  totalInterest: number;     // Total de juros
  effectiveRate: number;     // Taxa efetiva
}
```

## Desenvolvimento

- **Porta**: 3000
- **CORS**: Configurado para origens da aplicação móvel
- **Logging**: Log de requisições habilitado
- **Tratamento de Erro**: Respostas de erro abrangentes

## Estrutura do Projeto

```
src/
├── app.ts                 # Aplicação principal
├── controllers/           # Controladores da API
│   ├── productController.ts
│   └── simulationController.ts
├── data/                  # Armazenamento de dados
│   └── storage.ts
├── middleware/            # Middlewares
│   ├── cors.ts
│   └── validation.ts
├── routes/               # Definições de rotas
│   └── index.ts
├── types/                # Definições de tipos TypeScript
│   └── loan.ts
└── utils/                # Utilitários
    └── loanCalculations.ts
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor de produção
- `npm run prebuild` - Remove o diretório dist antes do build
- `npm run postbuild` - Exibe mensagem de sucesso após o build

## Integração

Esta API foi projetada para funcionar com a aplicação móvel de Empréstimos Pessoais. Para conectar:

1. Certifique-se de que a API esteja rodando na porta 3000
2. Na aplicação móvel, defina `USE_MOCK_API: false` em `constants/Api.ts`
3. A aplicação móvel se conectará automaticamente em `http://localhost:3000/api`

## Exemplo de Respostas

### Sucesso - Lista de Produtos
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Empréstimo Pessoal",
      "annualInterestRate": 18.5,
      "maxTermMonths": 60
    }
  ]
}
```

### Sucesso - Simulação
```json
{
  "success": true,
  "data": {
    "monthlyPayment": 926.23,
    "totalAmount": 11114.76,
    "totalInterest": 1114.76,
    "effectiveRate": 18.5
  }
}
```

### Erro - Validação
```json
{
  "success": false,
  "message": "Dados de entrada inválidos",
  "errors": [
    "O valor do empréstimo deve ser maior que zero",
    "O prazo deve ser um número inteiro positivo"
  ]
}
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Superset tipado do JavaScript
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **Nodemon** - Ferramenta de desenvolvimento para hot reload

## Configuração de Ambiente

A API utiliza as seguintes variáveis de ambiente:

- `PORT` - Porta do servidor (padrão: 3000)

## Logs e Monitoramento

A API inclui:
- Log de todas as requisições HTTP
- Tratamento centralizado de erros
- Endpoint de health check para monitoramento
- Validação de entrada com mensagens de erro detalhadas

## Licença

MIT

## Autor

Desenvolvido para a aplicação de Empréstimos Pessoais