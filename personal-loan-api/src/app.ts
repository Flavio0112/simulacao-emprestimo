import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { jsonErrorHandler, requestLogger } from './middleware/validation';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(jsonErrorHandler);

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Loan API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: {
        list: 'GET /api/produtos',
        create: 'POST /api/produtos',
      },
      simulations: {
        create: 'POST /api/simulacoes',
      },
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Personal Loan API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;