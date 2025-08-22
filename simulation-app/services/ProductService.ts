import { API_CONFIG } from '@/constants/Api';
import { LoanProduct } from '@/types/loan';
import { IProductService, ApiResponse, IHttpClient } from './interfaces';
import { httpClient } from './HttpClientService';

export class ProductService implements IProductService {
  constructor(private httpClientService: IHttpClient = httpClient) {}

  async getProducts(): Promise<ApiResponse<LoanProduct[]>> {
    try {
      const data = await this.httpClientService.get<LoanProduct[]>(API_CONFIG.ENDPOINTS.PRODUCTS);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Erro ao carregar produtos',
      };
    }
  }

  async createProduct(product: Omit<LoanProduct, 'id' | 'createdAt'>): Promise<ApiResponse<LoanProduct>> {
    try {
      const data = await this.httpClientService.post<LoanProduct>(API_CONFIG.ENDPOINTS.PRODUCTS, product);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as LoanProduct,
        message: error.response?.data?.message || 'Erro ao criar produto',
      };
    }
  }
}

// Export singleton instance
export const productService = new ProductService();