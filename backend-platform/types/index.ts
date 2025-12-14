// Type definitions for Klaew Klad Backend Platform

export type UserRole = 'client' | 'operator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Flood Types
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
