import type { FloodStatus, FloodForecast, RiskAssessment } from '../types';

export const mockFloodStatus: FloodStatus = {
  timestamp: new Date().toISOString(),
  severity: 'high',
  affectedAreas: [
    {
      id: 'area_1',
      name: 'U-Tapao Canal Zone',
      waterLevel: 2.5,
      status: 'flooding',
      population: 15000,
      coordinates: { lat: 7.0089, lng: 100.4747 },
      polygon: [
        { lat: 7.0050, lng: 100.4700 },
        { lat: 7.0050, lng: 100.4800 },
        { lat: 7.0130, lng: 100.4800 },
        { lat: 7.0130, lng: 100.4700 },
      ],
    },
    {
      id: 'area_2',
      name: 'Central Business District',
      waterLevel: 1.8,
      status: 'warning',
      population: 20000,
      coordinates: { lat: 7.0067, lng: 100.4725 },
    },
    {
      id: 'area_3',
      name: 'Kho Hong Intersection',
      waterLevel: 2.2,
      status: 'flooding',
      population: 10000,
      coordinates: { lat: 7.0045, lng: 100.4765 },
    },
  ],
  statistics: {
    totalAffected: 45000,
    roadsClosed: 23,
    sheltersActive: 8,
    evacuated: 1240,
  },
};

export const mockFloodForecasts: FloodForecast[] = Array.from({ length: 72 }, (_, i) => ({
  timestamp: new Date(Date.now() + i * 3600000).toISOString(),
  severity: i < 6 ? 'high' : i < 24 ? 'medium' : 'low',
  waterLevel: Math.max(0.5, 2.5 - i * 0.05 + Math.random() * 0.3),
  confidence: 0.95 - i * 0.01,
  rainfall: Math.max(0, 50 - i * 2 + Math.random() * 20),
}));

export const mockRiskAssessment: RiskAssessment = {
  nodes: [
    {
      id: 'hospital_1',
      name: 'Hat Yai Hospital',
      type: 'hospital',
      riskScore: 0.75,
      status: 'at-risk',
      timeToIsolation: 90,
      coordinates: { lat: 7.0101, lng: 100.4751 },
      elevation: 12.5,
      capacity: 500,
    },
    {
      id: 'shelter_1',
      name: 'Prince of Songkla University Gym',
      type: 'shelter',
      riskScore: 0.15,
      status: 'safe',
      coordinates: { lat: 7.0234, lng: 100.4901 },
      elevation: 25.0,
      capacity: 500,
    },
    {
      id: 'power_1',
      name: 'Central Power Substation',
      type: 'power',
      riskScore: 0.65,
      status: 'at-risk',
      timeToIsolation: 120,
      coordinates: { lat: 7.0078, lng: 100.4730 },
      elevation: 10.0,
    },
    {
      id: 'bridge_1',
      name: 'U-Tapao Bridge #3',
      type: 'bridge',
      riskScore: 0.85,
      status: 'isolated',
      timeToIsolation: 0,
      coordinates: { lat: 7.0055, lng: 100.4745 },
      elevation: 8.5,
    },
    {
      id: 'school_1',
      name: 'Hat Yai Municipal School',
      type: 'school',
      riskScore: 0.45,
      status: 'warning',
      timeToIsolation: 180,
      coordinates: { lat: 7.0092, lng: 100.4788 },
      elevation: 15.0,
    },
  ],
  edges: [
    {
      from: 'hospital_1',
      to: 'shelter_1',
      status: 'warning',
      waterDepth: 0.3,
      distance: 2.8,
    },
    {
      from: 'hospital_1',
      to: 'bridge_1',
      status: 'blocked',
      waterDepth: 1.5,
      distance: 0.8,
    },
    {
      from: 'power_1',
      to: 'hospital_1',
      status: 'warning',
      waterDepth: 0.4,
      distance: 0.5,
    },
    {
      from: 'school_1',
      to: 'shelter_1',
      status: 'passable',
      waterDepth: 0.1,
      distance: 1.9,
    },
  ],
  updatedAt: new Date().toISOString(),
};
