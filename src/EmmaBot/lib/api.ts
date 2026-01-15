// Enhanced API utility layer using Axios with class-based implementation
// Provides better error handling, interceptors, and eliminates redundancy

import type { ApiError } from '@emma/types';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// Base API class with common functionality
class BaseApiClient {
  protected client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || this.getBaseURL(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private getBaseURL(): string {
    const baseURL =
      import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_BASE_URL;

    if (!baseURL) {
      console.warn(
        'No API base URL found in environment variables. ' +
          'Please set VITE_SERVER_URL or VITE_BASE_URL in your .env file. ' +
          'Using relative URLs as fallback.'
      );
      return '';
    }

    return baseURL;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        if (import.meta.env.DEV) {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }
        return config;
      },
      error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },

      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: 0,
        };

        if (error.response) {
          apiError.status = error.response.status;
          apiError.message =
            (error.response.data as { message?: string })?.message ||
            error.response.statusText ||
            `HTTP ${error.response.status}`;
        } else if (error.request) {
          apiError.message = 'Network error - no response received';
        } else {
          apiError.message = error.message || 'Request setup error';
        }

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // Method to add default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers,
    };
  }

  // Method to set a single default header
  setDefaultHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  // Method to remove default headers
  removeDefaultHeaders(headerKeys: string[]): void {
    headerKeys.forEach(key => {
      delete this.client.defaults.headers.common[key];
    });
  }

  // Method to remove a single default header
  removeDefaultHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  // Method to get current default headers
  getDefaultHeaders(): Record<string, string> {
    return this.client.defaults.headers.common as Record<string, string>;
  }

  // Generic request method
  protected async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await this.client.request<T>({ url: endpoint, ...config });
    return response.data;
  }

  // HTTP method implementations
  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data,
    });
  }

  put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      data,
    });
  }

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      data,
    });
  }

  upload<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }
}

// Helper function to create custom API client
export function createApiClient(baseURL?: string): BaseApiClient {
  return new BaseApiClient(baseURL);
}
