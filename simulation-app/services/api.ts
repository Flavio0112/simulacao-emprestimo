// Refactored API service - now exports the new service instances for backward compatibility
// The actual implementations are in separate service files

export { productService } from './ProductService';
export { simulationService } from './SimulationService';
export { httpClient as default } from './HttpClientService';