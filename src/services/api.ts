/**
 * Klaew Klad API Service
 * Connects frontend to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Types
export interface FloodZone {
  id: string;
  name: string;
  coordinates: number[][][];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  water_depth: number;
  affected_population: number;
}

export interface Facility {
  id: string;
  name: string;
  facility_type: string;
  coordinates: [number, number];
  status: string;
  capacity?: number;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: 'clear' | 'congested' | 'closed';
  estimated_time: number;
}

export interface DashboardSummary {
  flood_zones: {
    total: number;
    high_risk: number;
    affected_population: number;
  };
  facilities: {
    total: number;
    at_risk: number;
    operational: number;
  };
  evacuation: {
    active_routes: number;
    closed_routes: number;
  };
  water_levels: {
    current_max: number;
    average: number;
    trend: 'rising' | 'falling' | 'stable';
  };
  last_updated: string;
}

export interface SimulationParams {
  rainfall_mm_per_hour: number;
  duration_hours: number;
  tide_factor?: number;
}

export interface SimulationResult {
  summary: {
    total_rainfall_mm: number;
    excess_water_mm: number;
    flood_severity: string;
    peak_time_hours: number;
    estimated_duration_hours: number;
  };
  zones_affected: Array<{
    zone_id: string;
    zone_name: string;
    predicted_depth: number;
    depth_category: string;
    risk_score: number;
    affected_population: number;
  }>;
  total_affected_population: number;
  facilities_at_risk: Array<{
    id: string;
    risk: string;
  }>;
  routes_affected: Array<{
    id: string;
    status: string;
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    message: string;
  }>;
}

// API functions
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.fetch('/health');
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.fetch('/api/v1/dashboard/summary');
  }

  // Flood zones
  async getFloodZones(): Promise<FloodZone[]> {
    return this.fetch('/api/v1/flood/zones');
  }

  async getFloodZoneById(id: string): Promise<FloodZone> {
    return this.fetch(`/api/v1/flood/zones/${id}`);
  }

  // Facilities
  async getFacilities(facilityType?: string): Promise<Facility[]> {
    const params = facilityType ? `?facility_type=${facilityType}` : '';
    return this.fetch(`/api/v1/facilities${params}`);
  }

  async getFacilityById(id: string): Promise<Facility> {
    return this.fetch(`/api/v1/facilities/${id}`);
  }

  // Evacuation routes
  async getEvacuationRoutes(): Promise<EvacuationRoute[]> {
    return this.fetch('/api/v1/evacuation/routes');
  }

  async getEvacuationRoute(id: string): Promise<EvacuationRoute> {
    return this.fetch(`/api/v1/evacuation/routes/${id}`);
  }

  // Simulation
  async runQuickSimulation(params: SimulationParams): Promise<SimulationResult> {
    return this.fetch('/api/v1/simulation/quick', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async startSimulation(params: SimulationParams): Promise<{ scenario_id: string }> {
    return this.fetch('/api/v1/simulation/', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // AI endpoints
  async translateSAR(sarData: number[][]): Promise<{ optical_image: number[][] }> {
    return this.fetch('/api/v1/ai/sar-translate', {
      method: 'POST',
      body: JSON.stringify({ sar_image: sarData }),
    });
  }

  async propagateRisk(floodDepths: Record<string, number>): Promise<{
    zone_risk_scores: Record<string, number>;
    facility_risks: Record<string, number>;
    critical_warnings: string[];
  }> {
    return this.fetch('/api/v1/ai/risk-propagation', {
      method: 'POST',
      body: JSON.stringify({ flood_depths: floodDepths }),
    });
  }

  async planEvacuation(params: {
    flood_zones: string[];
    population: number;
    available_routes: string[];
  }): Promise<{
    routes: Array<{
      route_id: string;
      priority: number;
      estimated_time: number;
      population_assigned: number;
    }>;
    total_evacuation_time: number;
  }> {
    return this.fetch('/api/v1/ai/evacuation-plan', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

// WebSocket manager for real-time updates
class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;

  connect(
    channel: string,
    onMessage: (data: unknown) => void,
    onError?: (error: Event) => void
  ): () => void {
    const wsUrl = `${WS_BASE_URL}/ws/${channel}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected to ${channel}`);
      this.reconnectAttempts.set(channel, 0);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        onMessage(event.data);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error on ${channel}:`, error);
      onError?.(error);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected from ${channel}`);
      this.connections.delete(channel);

      // Attempt reconnection
      const attempts = this.reconnectAttempts.get(channel) || 0;
      if (attempts < this.maxReconnectAttempts) {
        this.reconnectAttempts.set(channel, attempts + 1);
        setTimeout(() => {
          this.connect(channel, onMessage, onError);
        }, Math.pow(2, attempts) * 1000);
      }
    };

    this.connections.set(channel, ws);

    // Return cleanup function
    return () => {
      ws.close();
      this.connections.delete(channel);
    };
  }

  disconnect(channel: string): void {
    const ws = this.connections.get(channel);
    if (ws) {
      ws.close();
      this.connections.delete(channel);
    }
  }

  disconnectAll(): void {
    this.connections.forEach((ws, channel) => {
      ws.close();
      this.connections.delete(channel);
    });
  }

  isConnected(channel: string): boolean {
    const ws = this.connections.get(channel);
    return ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instances
export const api = new ApiService();
export const wsManager = new WebSocketManager();

// Export types
export type { ApiService, WebSocketManager };
