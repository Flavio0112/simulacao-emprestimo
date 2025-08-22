import { Request, Response, NextFunction } from 'express';

// Middleware to parse JSON and handle parsing errors
export const jsonErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'POST' && req.headers['content-type']?.includes('application/json')) {
    // Check if body is empty for POST requests
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Corpo da requisição não pode estar vazio',
      });
      return;
    }
  }
  next();
};

// Log incoming requests
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  if (req.method === 'POST' && req.body) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
};