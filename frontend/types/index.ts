// Type definitions for Klaew Klad

export type UserRole = 'client' | 'operator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

// Flood Status Types
export type FloodSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AreaStatus = 'normal' | 'warning' | 'flooding' | 'evacuating';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AffectedArea {
  id: string;
  name: string;
  waterLevel: number;
  status: AreaStatus;
  population: number;
  coordinates: Coordinates;
  polygon?: Coordinates[];
}

export interface FloodStatistics {
  totalAffected: number;
  roadsClosed: number;
  sheltersActive: number;
  evacuated: number;
}

export interface FloodStatus {
  timestamp: string;
  severity: FloodSeverity;
  affectedAreas: AffectedArea[];
  statistics: FloodStatistics;
}

// Forecast Types
export interface FloodForecast {
  timestamp: string;
  severity: FloodSeverity;
  waterLevel: number;
  confidence: number;
  rainfall?: number;
}

// Risk Assessment Types
export type NodeType = 'hospital' | 'shelter' | 'power' | 'road' | 'bridge' | 'school' | 'market';
export type NodeStatus = 'safe' | 'at-risk' | 'isolated' | 'flooded';

export interface InfrastructureNode {
  id: string;
  name: string;
  type: NodeType;
  riskScore: number;
  status: NodeStatus;
  timeToIsolation?: number;
  coordinates: Coordinates;
  elevation?: number;
  capacity?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  status: 'passable' | 'warning' | 'blocked';
  waterDepth: number;
  distance?: number;
}

export interface RiskAssessment {
  nodes: InfrastructureNode[];
  edges: GraphEdge[];
  updatedAt: string;
}

// Evacuation Types
export interface Shelter {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: 'open' | 'full' | 'closed';
  coordinates: Coordinates;
  facilities: string[];
  contactPhone?: string;
}

export interface EvacuationRoute {
  id: string;
  destination: string;
  distance: number;
  duration: number;
  safetyScore: number;
  waypoints: Coordinates[];
  instructions?: string[];
}

export interface EvacuationRequest {
  origin: Coordinates;
  destinations: Array<{
    id: string;
    lat: number;
    lng: number;
  }>;
  priority: 'fastest' | 'safest';
}

// Alert Types
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  expiry?: string;
  areas?: string[];
  actionRequired?: boolean;
}

export interface BroadcastAlertRequest {
  severity: AlertSeverity;
  title: string;
  message: string;
  areas: string[];
  expiry?: string;
}

// AI Service Types
export interface SARTranslationResult {
  imageUrl: string;
  ssim: number;
  processingTime: number;
}

export interface FloodSegmentationResult {
  maskUrl: string;
  floodArea: number;
  iou: number;
  affectedBuildings: number;
}

export interface RiskPropagationResult {
  riskScores: Record<string, number>;
  cascadeEvents: Array<{
    node: string;
    time: number;
    impact: string;
  }>;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// WebSocket Message Types
export type WSMessageType = 
  | 'flood_update' 
  | 'alert_broadcast' 
  | 'risk_update' 
  | 'evacuation_update';

export interface WSMessage<T = unknown> {
  type: WSMessageType;
  data: T;
  timestamp: string;
}

// Map Types
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface MapLayer {
  id: string;
  type: 'flood' | 'risk' | 'route' | 'shelter' | 'infrastructure';
  visible: boolean;
  opacity: number;
}

// Dashboard Types
export interface DashboardStats {
  activeAlerts: number;
  affectedPopulation: number;
  openShelters: number;
  blockedRoads: number;
  lastUpdate: string;
}
