import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { SimulationController } from '../controllers/simulationController';

const router = Router();

// Product routes
router.get('/produtos', ProductController.getProducts);
router.post('/produtos', ProductController.createProduct);

// Simulation routes
router.post('/simulacoes', SimulationController.simulateLoan);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Loan API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;