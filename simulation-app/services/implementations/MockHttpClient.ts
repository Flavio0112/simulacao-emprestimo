import { IHttpClient } from '../interfaces';

export class MockHttpClient implements IHttpClient {
  private simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
  }

  async get<T>(url: string): Promise<T> {
    await this.simulateNetworkDelay();
    
    if (url.includes('/produtos')) {
      return {
        success: true,
        data: []
      } as unknown as T;
    }
    
    throw new Error(`GET ${url} not implemented in MockHttpClient`);
  }

  async post<T>(url: string, data: any): Promise<T> {
    await this.simulateNetworkDelay();
    
    if (url.includes('/produtos')) {
      return {
        success: true,
        data: {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date()
        }
      } as unknown as T;
    }
    
    if (url.includes('/simulacoes')) {
      return {
        success: true,
        data: {
          // Mock simulation result
        }
      } as unknown as T;
    }
    
    throw new Error(`POST ${url} not implemented in MockHttpClient`);
  }

}