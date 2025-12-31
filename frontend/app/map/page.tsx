/**
 * 🗺️ Page B: Operation Map (Real-time Analysis)
 *
 * Full-screen interactive map for flood monitoring and evacuation planning.
 * Inspired by GISTDA's map interface with floating panels and dark theme.
 *
 * Features:
 * - MapLibre GL base map with multiple layer styles
 * - Sentinel-1 SAR layer (raw)
 * - CycleGAN de-clouded optical layer (AI-generated)
 * - GNN risk propagation heatmap
 * - RL-optimized evacuation routes
 * - Time-travel slider for forecast visualization
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { MapRef, ViewState } from 'react-map-gl';
import {
  Layers,
  Eye,
  EyeOff,
  Navigation,
  MapPin,
  Route,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
  Activity,
  Shield,
} from 'lucide-react';
import { useMapStore, useEvacuationStore } from '@/lib/stores/map-store';
import { TimeTravelSlider } from '@/components/TimeTravelSlider';
import 'maplibre-gl/dist/maplibre-gl.css';

// ============================================================================
// Types
// ============================================================================

interface LayerControlProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface EvacuationPlannerProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ============================================================================
// Sub-Components
// ============================================================================

const LeftFloatingSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'simulation'>('simulation');

  return (
    <div className="pointer-events-none absolute left-6 top-6 bottom-6 w-96 flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="pointer-events-auto rounded-2xl bg-white/95 backdrop-blur-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'monitor'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="inline-block w-4 h-4 mr-2" />
            Monitor
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'simulation'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Shield className="inline-block w-4 h-4 mr-2" />
            Simulation
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="pointer-events-auto flex-1 overflow-auto">
        {activeTab === 'monitor' ? <MonitorPanel /> : <SimulationPanel />}
      </div>
    </div>
  );
};

const MonitorPanel: React.FC = () => {
  const { selectedDistrict } = useMapStore();

  // Mock data - replace with real API
  const floodedDistricts = [
    { id: '1', name: 'Hat Yai', depth: 0.8, severity: 'medium' },
    { id: '2', name: 'Khlong Hae', depth: 1.2, severity: 'high' },
    { id: '3', name: 'Kho Hong', depth: 0.5, severity: 'low' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-3">
      {floodedDistricts.map((district) => (
        <div
          key={district.id}
          className={`rounded-xl border-l-4 ${getSeverityColor(district.severity)} bg-white p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{district.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Water Depth: <span className="font-bold">{district.depth}m</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              district.severity === 'high' ? 'bg-red-100 text-red-700' :
              district.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {district.severity.toUpperCase()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SimulationPanel: React.FC = () => {
  const { timeOffset } = useMapStore();

  // Mock bookmarks for critical moments
  const bookmarks = [
    { offset: 60, label: 'First Overflow', severity: 'warning' as const },
    { offset: 120, label: 'Peak Flood', severity: 'danger' as const },
  ];

  return (
    <div className="space-y-4">
      <TimeTravelSlider
        bookmarks={bookmarks}
        isLoading={false}
      />

      {/* Impact Summary */}
      <div className="rounded-xl bg-white/95 backdrop-blur-lg shadow-xl border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Predicted Impact at {timeOffset > 0 ? '+' : ''}{timeOffset}min
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Flooded Area</span>
            <span className="text-sm font-bold text-gray-900">2.3 km²</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">People Affected</span>
            <span className="text-sm font-bold text-red-600">8,500</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Buildings at Risk</span>
            <span className="text-sm font-bold text-yellow-600">340</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Roads Blocked</span>
            <span className="text-sm font-bold text-gray-900">12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightFloatingToolbar: React.FC = () => {
  const { visibleLayers, toggleLayer } = useMapStore();
  const [isCycleGANActive, setIsCycleGANActive] = useState(false);

  const handleDeCloudToggle = () => {
    setIsCycleGANActive(!isCycleGANActive);
    toggleLayer('cycleGAN-optical');
  };

  return (
    <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-3">
      {/* AI De-cloud Toggle */}
      <button
        onClick={handleDeCloudToggle}
        className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-xl transition-all ${
          isCycleGANActive
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white/95 backdrop-blur-lg text-gray-700 hover:bg-gray-50'
        }`}
        title="AI De-cloud (CycleGAN)"
      >
        {isCycleGANActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      </button>

      {/* Layer Toggle */}
      <button
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 backdrop-blur-lg text-gray-700 shadow-xl hover:bg-gray-50"
        title="Layer Controls"
      >
        <Layers className="h-5 w-5" />
      </button>

      {/* My Location */}
      <button
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 backdrop-blur-lg text-gray-700 shadow-xl hover:bg-gray-50"
        title="My Location"
      >
        <Navigation className="h-5 w-5" />
      </button>
    </div>
  );
};

const BottomEvacuationPanel: React.FC<EvacuationPlannerProps> = ({ isOpen, onToggle }) => {
  const {
    fromLocation,
    toLocation,
    routes,
    isCalculating,
    setFromLocation,
    setToLocation,
    calculateRoutes,
  } = useEvacuationStore();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white shadow-xl hover:bg-blue-600 transition-all"
      >
        <Route className="h-5 w-5" />
        <span className="font-semibold">Evacuation Planner</span>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 w-[600px] max-h-96 overflow-auto rounded-2xl bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <Route className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evacuation Route Planner</h3>
                  <p className="text-sm text-gray-500">AI-optimized safe routes</p>
                </div>
              </div>
              <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Input Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From (Current Location)
                </label>
                <input
                  type="text"
                  placeholder="Click on map or enter address"
                  value={fromLocation?.label || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To (Shelter Destination)
                </label>
                <input
                  type="text"
                  placeholder="Click on map or select shelter"
                  value={toLocation?.label || ''}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <button
                onClick={calculateRoutes}
                disabled={!fromLocation || !toLocation || isCalculating}
                className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? 'Calculating...' : 'Find Safe Route'}
              </button>
            </div>

            {/* Route Results */}
            {routes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Recommended Routes</h4>
                {routes.map((route, index) => (
                  <div
                    key={route.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">Route {index + 1}</span>
                          <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            route.safetyScore > 0.8 ? 'bg-green-100 text-green-700' :
                            route.safetyScore > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            Safety: {(route.safetyScore * 100).toFixed(0)}%
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{route.distance.toFixed(1)} km</span>
                          <span>•</span>
                          <span>{route.duration} min</span>
                        </div>

                        {route.warnings.length > 0 && (
                          <div className="mt-2 flex items-start gap-2 text-sm text-yellow-700">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{route.warnings[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const TopNotificationBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-auto absolute top-6 left-1/2 -translate-x-1/2 max-w-2xl">
      <div className="rounded-xl bg-red-500 text-white px-6 py-4 shadow-2xl flex items-start gap-3">
        <AlertCircle className="h-6 w-6 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Critical Alert</h4>
          <p className="text-sm">
            U-Tapao Canal water level rising rapidly. Expected overflow in 2 hours at Zone 4.
          </p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const OperationMap: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const { viewport, updateViewport, timeOffset } = useMapStore();
  const [isEvacuationPanelOpen, setIsEvacuationPanelOpen] = useState(false);

  // Map style (using Maptiler or OSM)
  const mapStyle = 'https://api.maptiler.com/maps/basic/style.json?key=YOUR_MAPTILER_KEY';

  const handleViewportChange = (evt: ViewState) => {
    updateViewport(evt);
  };

  // Fetch flood data when time offset changes
  useEffect(() => {
    // TODO: Fetch flood prediction data from API
    console.log('[Map] Fetching data for time offset:', timeOffset);
  }, [timeOffset]);

  return (
    <div className="relative h-screen w-full bg-gray-900">
      {/* MapLibre GL Map */}
      <Map
        ref={mapRef}
        {...viewport}
        onMove={(evt) => handleViewportChange(evt.viewState)}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {/* Built-in Controls */}
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />

        {/* TODO: Add custom layers (SAR, CycleGAN, Flood Extent, etc.) */}
        {/* Example:
        <Source
          id="flood-extent"
          type="geojson"
          data={floodExtentGeoJSON}
        >
          <Layer
            id="flood-extent-fill"
            type="fill"
            paint={{
              'fill-color': '#EF4444',
              'fill-opacity': 0.6,
            }}
          />
        </Source>
        */}
      </Map>

      {/* Overlay Components */}
      <TopNotificationBar />
      <LeftFloatingSidebar />
      <RightFloatingToolbar />
      <BottomEvacuationPanel
        isOpen={isEvacuationPanelOpen}
        onToggle={() => setIsEvacuationPanelOpen(!isEvacuationPanelOpen)}
      />

      {/* Branding */}
      <div className="pointer-events-none absolute bottom-6 left-6 rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg">
        <p className="text-xs text-gray-600">
          Powered by <span className="font-semibold text-purple-600">Huawei MindSpore</span>
        </p>
      </div>
    </div>
  );
};

export default OperationMap;
