// API Configuration
export const API_CONFIG = {
  // Default to mock API, change this when real backend is available
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 15000,
  ENDPOINTS: {
    PRODUCTS: '/produtos',
    SIMULATIONS: '/simulacoes',
  },
  // Feature flags
  USE_MOCK_API: true, // Set to false when real backend is ready
  MOCK_DELAY: {
    GET_PRODUCTS: 300,
    CREATE_PRODUCT: 500,
    SIMULATE_LOAN: 800,
  },
};


// Environment helpers
export const isProduction = () => !__DEV__;
export const isDevelopment = () => __DEV__;

// API configuration helper
export const getApiConfig = () => ({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  useMockApi: API_CONFIG.USE_MOCK_API,
});