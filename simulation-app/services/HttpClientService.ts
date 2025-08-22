import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/constants/Api';
import { IHttpClient } from './interfaces';

// HttpClientService - excluded from test coverage via Jest configuration
export class HttpClientService implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add any authentication headers here
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle network errors, timeouts, etc.
        if (error.response) {
          // Server responded with error status
          console.error('API Error Response:', error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('API Network Error:', error.request);
        } else {
          // Something else happened
          console.error('API Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<{data: T}> = await this.axiosInstance.get(url);
    return response.data.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data);
    return response.data as T;
  }
}

// Export a singleton instance
export const httpClient = new HttpClientService();