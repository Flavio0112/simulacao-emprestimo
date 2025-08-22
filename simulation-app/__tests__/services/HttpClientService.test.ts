import { HttpClientService } from '../../services/HttpClientService';
import { API_CONFIG } from '../../constants/Api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

describe('HttpClientService', () => {
  let httpClient: HttpClientService;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    const axios = require('axios');
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
      get: jest.fn(),
      post: jest.fn(),
    };
    axios.create.mockReturnValue(mockAxiosInstance);
    
    httpClient = new HttpClientService();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      const axios = require('axios');
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request and response interceptors', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should make GET request and return data.data', async () => {
      const mockResponse = {
        data: {
          data: { id: '1', name: 'Test Product' }
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await httpClient.get('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
      expect(result).toEqual({ id: '1', name: 'Test Product' });
    });

    it('should handle GET request errors', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get('/test-endpoint')).rejects.toThrow('Network Error');
    });
  });

  describe('post method', () => {
    it('should make POST request and return data', async () => {
      const mockResponse = {
        data: { id: '1', name: 'Created Product' }
      };
      const postData = { name: 'New Product', rate: 15.5 };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post('/test-endpoint', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData);
      expect(result).toEqual({ id: '1', name: 'Created Product' });
    });

    it('should handle POST request errors', async () => {
      const error = new Error('Server Error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(httpClient.post('/test-endpoint', {})).rejects.toThrow('Server Error');
    });
  });

  describe('interceptors', () => {
    it('should setup request interceptor that passes config through', () => {
      const requestUseCall = mockAxiosInstance.interceptors.request.use.mock.calls[0];
      const requestInterceptor = requestUseCall[0];
      
      const mockConfig = { url: '/test', headers: {} };
      const result = requestInterceptor(mockConfig);
      
      expect(result).toBe(mockConfig);
    });

    it('should setup request interceptor error handler', () => {
      const requestUseCall = mockAxiosInstance.interceptors.request.use.mock.calls[0];
      const errorHandler = requestUseCall[1];
      
      const error = new Error('Request Error');
      expect(() => errorHandler(error)).rejects.toBe(error);
    });

    it('should setup response interceptor that passes response through', () => {
      const responseUseCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseInterceptor = responseUseCall[0];
      
      const mockResponse = { data: 'test data' };
      const result = responseInterceptor(mockResponse);
      
      expect(result).toBe(mockResponse);
    });

    it('should handle response errors with response data', () => {
      const responseUseCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const errorHandler = responseUseCall[1];
      
      const error = {
        response: {
          data: { message: 'Server error' }
        }
      };
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => errorHandler(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error Response:', { message: 'Server error' });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle response errors without response (network error)', () => {
      const responseUseCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const errorHandler = responseUseCall[1];
      
      const error = {
        request: { url: '/test' },
        message: 'Network Error'
      };
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => errorHandler(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Network Error:', { url: '/test' });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle generic response errors', () => {
      const responseUseCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const errorHandler = responseUseCall[1];
      
      const error = {
        message: 'Generic Error'
      };
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => errorHandler(error)).rejects.toBe(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error:', 'Generic Error');
      
      consoleErrorSpy.mockRestore();
    });
  });
});