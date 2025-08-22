import cors from 'cors';

// CORS configuration for mobile app
export const corsOptions = {
  origin: [
    'http://localhost:8081',    // Expo development server
    'http://localhost:19006',   // Expo web
    'exp://localhost:19000',    // Expo development
    'http://192.168.1.1:8081',  // Local network (adjust IP as needed)
    'http://10.0.2.2:8081',     // Android emulator
    'http://127.0.0.1:8081',    // Localhost variants
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);