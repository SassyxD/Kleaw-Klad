import axios, { AxiosInstance, AxiosError } from 'axios';
import type { 
  APIResponse, 
  LoginRequest, 
  LoginResponse,
  FloodStatus,
  FloodForecast,
  RiskAssessment,
  EvacuationRequest,
  EvacuationRoute,
  Shelter,
  Alert,
  BroadcastAlertRequest
} from '@/types';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, attempt refresh
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse['data']>> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      this.setToken(response.data.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    }
    return response.data;
  }

  async refreshToken(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.clearToken();
      return;
    }

    try {
      const response = await this.client.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
      if (response.data.success) {
        this.setToken(response.data.data.token);
      }
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Flood endpoints
  async getCurrentFloodStatus(): Promise<APIResponse<FloodStatus>> {
    const response = await this.client.get<APIResponse<FloodStatus>>('/flood/current-status');
    return response.data;
  }

  async getFloodForecast(hours: number = 24): Promise<APIResponse<{ forecasts: FloodForecast[] }>> {
    const response = await this.client.get<APIResponse<{ forecasts: FloodForecast[] }>>(
      `/flood/forecast?hours=${hours}`
    );
    return response.data;
  }

  async getRiskAssessment(): Promise<APIResponse<RiskAssessment>> {
    const response = await this.client.get<APIResponse<RiskAssessment>>('/flood/risk-assessment');
    return response.data;
  }

  // Evacuation endpoints
  async calculateEvacuationRoutes(request: EvacuationRequest): Promise<APIResponse<{ routes: EvacuationRoute[] }>> {
    const response = await this.client.post<APIResponse<{ routes: EvacuationRoute[] }>>(
      '/evacuation/routes',
      request
    );
    return response.data;
  }

  async getShelters(): Promise<APIResponse<{ shelters: Shelter[] }>> {
    const response = await this.client.get<APIResponse<{ shelters: Shelter[] }>>('/evacuation/shelters');
    return response.data;
  }

  // Alert endpoints
  async getAlerts(): Promise<APIResponse<{ alerts: Alert[] }>> {
    const response = await this.client.get<APIResponse<{ alerts: Alert[] }>>('/alerts');
    return response.data;
  }

  async broadcastAlert(alert: BroadcastAlertRequest): Promise<APIResponse<{ alertId: string; sentTo: number }>> {
    const response = await this.client.post<APIResponse<{ alertId: string; sentTo: number }>>(
      '/alerts',
      alert
    );
    return response.data;
  }
}

// Create singleton instance
const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

export default apiClient;
