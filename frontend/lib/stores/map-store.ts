/**
 * 🗄️ Zustand State Management Stores
 *
 * Centralized state management for Klaew Klad platform
 * using Zustand for lightweight, performant state handling.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type LayerType =
  | 'sar-raw'
  | 'cycleGAN-optical'
  | 'flood-extent'
  | 'risk-heatmap'
  | 'evacuation-routes'
  | 'critical-assets';

export type BaseMapStyle = 'satellite' | 'terrain' | 'grayscale';

export type SystemStatus = 'normal' | 'alert' | 'critical';

export interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  actual?: number;
  predicted?: number;
  confidence?: number;
}

export interface DistrictRisk {
  id: string;
  name: string;
  nameEn: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  waterDepth: number;
  population: number;
  affectedBuildings: number;
  affectedRoads: number;
}

export interface AIRecommendation {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface EvacuationRoute {
  id: string;
  from: { lat: number; lng: number; label: string };
  to: { lat: number; lng: number; label: string };
  geometry: GeoJSON.LineString;
  distance: number;
  duration: number;
  safetyScore: number;
  warnings: string[];
}

// ============================================================================
// Map Store
// ============================================================================

interface MapState {
  // Time Travel
  timeOffset: number; // minutes from now (-180 to +180)
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 4;

  // Layers
  visibleLayers: Set<LayerType>;
  activeBaseMap: BaseMapStyle;

  // Map State
  viewport: Viewport;

  // Selection
  selectedDistrict: string | null;
  selectedAsset: string | null;

  // Loading States
  isLoadingForecast: boolean;
  isLoadingSAR: boolean;
  isLoadingCycleGAN: boolean;

  // Actions
  setTimeOffset: (offset: number) => void;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: 1 | 2 | 4) => void;

  toggleLayer: (layer: LayerType) => void;
  setVisibleLayers: (layers: LayerType[]) => void;
  setBaseMap: (style: BaseMapStyle) => void;

  updateViewport: (viewport: Partial<Viewport>) => void;
  flyTo: (location: { lat: number; lng: number; zoom?: number }) => void;

  selectDistrict: (id: string | null) => void;
  selectAsset: (id: string | null) => void;

  setLoadingState: (key: 'forecast' | 'sar' | 'cycleGAN', isLoading: boolean) => void;

  resetMapState: () => void;
}

const DEFAULT_VIEWPORT: Viewport = {
  longitude: 100.4736, // Hat Yai city center
  latitude: 7.0067,
  zoom: 12,
  bearing: 0,
  pitch: 0,
};

export const useMapStore = create<MapState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        timeOffset: 0,
        isPlaying: false,
        playbackSpeed: 1,

        visibleLayers: new Set<LayerType>(['flood-extent', 'critical-assets']),
        activeBaseMap: 'grayscale',

        viewport: DEFAULT_VIEWPORT,

        selectedDistrict: null,
        selectedAsset: null,

        isLoadingForecast: false,
        isLoadingSAR: false,
        isLoadingCycleGAN: false,

        // Actions
        setTimeOffset: (offset) => {
          set({ timeOffset: offset, isPlaying: false });
        },

        togglePlayback: () => {
          set((state) => ({ isPlaying: !state.isPlaying }));
        },

        setPlaybackSpeed: (speed) => {
          set({ playbackSpeed: speed });
        },

        toggleLayer: (layer) => {
          set((state) => {
            const newLayers = new Set(state.visibleLayers);
            if (newLayers.has(layer)) {
              newLayers.delete(layer);
            } else {
              newLayers.add(layer);
            }
            return { visibleLayers: newLayers };
          });
        },

        setVisibleLayers: (layers) => {
          set({ visibleLayers: new Set(layers) });
        },

        setBaseMap: (style) => {
          set({ activeBaseMap: style });
        },

        updateViewport: (viewport) => {
          set((state) => ({
            viewport: { ...state.viewport, ...viewport },
          }));
        },

        flyTo: ({ lat, lng, zoom = 14 }) => {
          set((state) => ({
            viewport: {
              ...state.viewport,
              longitude: lng,
              latitude: lat,
              zoom,
            },
          }));
        },

        selectDistrict: (id) => {
          set({ selectedDistrict: id });
        },

        selectAsset: (id) => {
          set({ selectedAsset: id });
        },

        setLoadingState: (key, isLoading) => {
          const loadingKey = `isLoading${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof MapState;
          set({ [loadingKey]: isLoading } as Partial<MapState>);
        },

        resetMapState: () => {
          set({
            timeOffset: 0,
            isPlaying: false,
            playbackSpeed: 1,
            viewport: DEFAULT_VIEWPORT,
            selectedDistrict: null,
            selectedAsset: null,
          });
        },
      }),
      {
        name: 'map-storage',
        partialize: (state) => ({
          activeBaseMap: state.activeBaseMap,
          visibleLayers: Array.from(state.visibleLayers),
        }),
      }
    ),
    { name: 'MapStore' }
  )
);

// ============================================================================
// Dashboard Store
// ============================================================================

interface DashboardState {
  // System Metrics
  systemStatus: SystemStatus;
  lastUpdate: string | null;

  // Predictions
  predictedRainfall24h: number;
  peakFloodTime: string | null;
  confidenceScore: number;

  // Impact Metrics
  peopleAtRisk: number;
  buildingsAffected: number;
  roadsBlocked: number;

  // Chart Data
  waterLevelForecast: TimeSeriesPoint[];
  districtRisks: DistrictRisk[];
  aiRecommendations: AIRecommendation[];

  // Loading State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
  updateMetrics: (metrics: Partial<DashboardState>) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial State
      systemStatus: 'normal',
      lastUpdate: null,

      predictedRainfall24h: 0,
      peakFloodTime: null,
      confidenceScore: 0,

      peopleAtRisk: 0,
      buildingsAffected: 0,
      roadsBlocked: 0,

      waterLevelForecast: [],
      districtRisks: [],
      aiRecommendations: [],

      isLoading: false,
      error: null,

      // Actions
      fetchDashboardData: async () => {
        set({ isLoading: true, error: null });

        try {
          // Fetch all dashboard data in parallel
          const [statsRes, forecastRes, recommendationsRes] = await Promise.all([
            fetch('/api/dashboard/stats'),
            fetch('/api/dashboard/forecast'),
            fetch('/api/dashboard/recommendations'),
          ]);

          if (!statsRes.ok || !forecastRes.ok || !recommendationsRes.ok) {
            throw new Error('Failed to fetch dashboard data');
          }

          const stats = await statsRes.json();
          const forecast = await forecastRes.json();
          const recommendations = await recommendationsRes.json();

          set({
            systemStatus: stats.systemStatus,
            predictedRainfall24h: stats.predictions.rainfall24h,
            peakFloodTime: stats.predictions.peakTime,
            confidenceScore: stats.predictions.confidence,

            peopleAtRisk: stats.impact.peopleAtRisk,
            buildingsAffected: stats.impact.buildingsAffected,
            roadsBlocked: stats.impact.roadsBlocked,

            waterLevelForecast: forecast.waterLevels,
            districtRisks: forecast.districtRisks,

            aiRecommendations: recommendations.items,

            lastUpdate: new Date().toISOString(),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      subscribeToRealtime: () => {
        // TODO: Implement WebSocket or Server-Sent Events
        console.log('[Dashboard] Subscribing to real-time updates...');
      },

      unsubscribeFromRealtime: () => {
        console.log('[Dashboard] Unsubscribing from real-time updates...');
      },

      updateMetrics: (metrics) => {
        set(metrics);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'DashboardStore' }
  )
);

// ============================================================================
// Evacuation Store
// ============================================================================

interface EvacuationState {
  // Route Planning
  routes: EvacuationRoute[];
  selectedRoute: string | null;

  // Input
  fromLocation: { lat: number; lng: number; label: string } | null;
  toLocation: { lat: number; lng: number; label: string } | null;

  // Constraints
  maxWaterDepth: number; // meters
  avoidHighways: boolean;
  prioritizeShelters: boolean;

  // Loading
  isCalculating: boolean;
  error: string | null;

  // Actions
  setFromLocation: (location: { lat: number; lng: number; label: string }) => void;
  setToLocation: (location: { lat: number; lng: number; label: string }) => void;
  calculateRoutes: () => Promise<void>;
  selectRoute: (id: string | null) => void;
  setConstraints: (constraints: Partial<EvacuationState>) => void;
  clearRoutes: () => void;
}

export const useEvacuationStore = create<EvacuationState>()(
  devtools(
    (set, get) => ({
      // Initial State
      routes: [],
      selectedRoute: null,

      fromLocation: null,
      toLocation: null,

      maxWaterDepth: 0.5,
      avoidHighways: false,
      prioritizeShelters: true,

      isCalculating: false,
      error: null,

      // Actions
      setFromLocation: (location) => {
        set({ fromLocation: location });
      },

      setToLocation: (location) => {
        set({ toLocation: location });
      },

      calculateRoutes: async () => {
        const { fromLocation, toLocation, maxWaterDepth, avoidHighways } = get();

        if (!fromLocation || !toLocation) {
          set({ error: 'Please select both start and destination points' });
          return;
        }

        set({ isCalculating: true, error: null });

        try {
          const timeOffset = useMapStore.getState().timeOffset;

          const response = await fetch('/api/evacuation/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: fromLocation,
              to: toLocation,
              timeOffset,
              constraints: {
                maxDepth: maxWaterDepth,
                avoidHighways,
              },
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to calculate routes');
          }

          const data = await response.json();

          set({
            routes: data.routes,
            selectedRoute: data.routes[0]?.id || null,
            isCalculating: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isCalculating: false,
          });
        }
      },

      selectRoute: (id) => {
        set({ selectedRoute: id });
      },

      setConstraints: (constraints) => {
        set(constraints);
      },

      clearRoutes: () => {
        set({
          routes: [],
          selectedRoute: null,
          fromLocation: null,
          toLocation: null,
        });
      },
    }),
    { name: 'EvacuationStore' }
  )
);

// ============================================================================
// Auth Store
// ============================================================================

interface User {
  id: string;
  email: string;
  name: string;
  role: 'executive' | 'operator' | 'admin';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (email, password) => {
          set({ isLoading: true, error: null });

          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              throw new Error('Invalid credentials');
            }

            const data = await response.json();

            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false,
            });
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        },

        checkAuth: async () => {
          const { token } = get();

          if (!token) {
            set({ isAuthenticated: false });
            return;
          }

          set({ isLoading: true });

          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Invalid token');
            }

            const data = await response.json();

            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// ============================================================================
// Selector Hooks (Performance Optimization)
// ============================================================================

// Map Store Selectors
export const useTimeOffset = () => useMapStore((state) => state.timeOffset);
export const useIsPlaying = () => useMapStore((state) => state.isPlaying);
export const useVisibleLayers = () => useMapStore((state) => state.visibleLayers);
export const useViewport = () => useMapStore((state) => state.viewport);

// Dashboard Store Selectors
export const useSystemStatus = () => useDashboardStore((state) => state.systemStatus);
export const useDistrictRisks = () => useDashboardStore((state) => state.districtRisks);
export const useAIRecommendations = () => useDashboardStore((state) => state.aiRecommendations);

// Evacuation Store Selectors
export const useEvacuationRoutes = () => useEvacuationStore((state) => state.routes);
export const useSelectedRoute = () => useEvacuationStore((state) => state.selectedRoute);

// Auth Store Selectors
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
