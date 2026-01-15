// API-specific types for requests, responses, and error handling

// Generic API Types
export interface ApiRequest<T = unknown> {
  data?: T;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

// Voice API Types
export interface VoiceRequest {
  user_query: string;
  session_id: string;
  restaurant_id: string;
}

export interface VoiceResponse {
  transcript?: string;
  response?: string;
  orderData?: unknown;
  error?: string;
}
