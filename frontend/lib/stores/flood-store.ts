import { create } from 'zustand';
import type { 
  FloodStatus, 
  RiskAssessment, 
  Alert,
  Shelter,
  MapViewState 
} from '@/types';

interface FloodState {
  currentStatus: FloodStatus | null;
  riskAssessment: RiskAssessment | null;
  alerts: Alert[];
  shelters: Shelter[];
  mapView: MapViewState;
  selectedNode: string | null;
  
  setCurrentStatus: (status: FloodStatus) => void;
  setRiskAssessment: (assessment: RiskAssessment) => void;
  setAlerts: (alerts: Alert[]) => void;
  setShelters: (shelters: Shelter[]) => void;
  setMapView: (view: Partial<MapViewState>) => void;
  setSelectedNode: (nodeId: string | null) => void;
  addAlert: (alert: Alert) => void;
}

// Default view centered on Hat Yai
const DEFAULT_MAP_VIEW: MapViewState = {
  longitude: 100.4747,
  latitude: 7.0089,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

export const useFloodStore = create<FloodState>((set) => ({
  currentStatus: null,
  riskAssessment: null,
  alerts: [],
  shelters: [],
  mapView: DEFAULT_MAP_VIEW,
  selectedNode: null,

  setCurrentStatus: (currentStatus) =>
    set({ currentStatus }),

  setRiskAssessment: (riskAssessment) =>
    set({ riskAssessment }),

  setAlerts: (alerts) =>
    set({ alerts }),

  setShelters: (shelters) =>
    set({ shelters }),

  setMapView: (view) =>
    set((state) => ({
      mapView: { ...state.mapView, ...view },
    })),

  setSelectedNode: (selectedNode) =>
    set({ selectedNode }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),
}));
