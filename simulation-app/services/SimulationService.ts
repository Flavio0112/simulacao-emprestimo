import { API_CONFIG } from '@/constants/Api';
import { LoanSimulationRequest, LoanSimulationResult } from '@/types/loan';
import { ISimulationService, ApiResponse, IHttpClient } from './interfaces';
import { httpClient } from './HttpClientService';

export class SimulationService implements ISimulationService {
  constructor(private httpClientService: IHttpClient = httpClient) {}

  async simulateLoan(request: LoanSimulationRequest): Promise<ApiResponse<LoanSimulationResult>> {
    try {
      const data = await this.httpClientService.post<{ data: LoanSimulationResult} >(
        API_CONFIG.ENDPOINTS.SIMULATIONS, 
        request
      );
      return {
        success: true,
        data: data.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as LoanSimulationResult,
        message: error.response?.data?.message || 'Erro ao realizar simulação',
      };
    }
  }
}

// Export singleton instance
export const simulationService = new SimulationService();