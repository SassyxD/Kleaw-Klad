/**
 * 📊 Page A: Executive Dashboard
 *
 * High-level situational awareness interface for city mayors and emergency commanders.
 * Inspired by GISTDA's summary dashboard with clean, data-dense design.
 *
 * Features:
 * - Real-time system status indicators
 * - 24-hour rainfall predictions from Huawei ModelArts
 * - Water level forecast charts
 * - District risk assessment visualization
 * - AI-generated recommendations from MindSpore GNN
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CloudRain,
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Sparkles,
  ArrowRight,
  Activity,
  Building,
  Shield,
  Waves,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useDashboardStore } from '@/lib/stores/map-store';
import Image from 'next/image';

// ============================================================================
// Types
// ============================================================================

type StatusLevel = 'normal' | 'alert' | 'critical';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  status: StatusLevel;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

// ============================================================================
// Sub-Components
// ============================================================================

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  status,
  trend,
}) => {
  const statusColors = {
    normal: {
      border: 'border-green-400',
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconBg: 'bg-green-500',
    },
    alert: {
      border: 'border-yellow-400',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      iconBg: 'bg-yellow-500',
    },
    critical: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-500',
    },
  };

  const colors = statusColors[status];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 shadow-xl transition-all hover:shadow-2xl ${
        status === 'critical' ? 'animate-pulse' : ''
      }`}
    >
      {/* Icon */}
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: 'h-6 w-6 text-white',
          })}
        </div>

        {/* Trend Badge */}
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              trend.direction === 'up'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${colors.text}`}>{value}</p>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Decorative Element */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${colors.iconBg} opacity-10`} />
    </div>
  );
};

const AIInsightsPanel: React.FC = () => {
  const { aiRecommendations } = useDashboardStore();

  const severityColors = {
    info: 'border-blue-500 bg-blue-50 text-blue-700',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    danger: 'border-red-500 bg-red-50 text-red-700',
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-500">Powered by Huawei MindSpore GNN</p>
        </div>
      </div>

      <div className="space-y-3">
        {aiRecommendations.length === 0 ? (
          <p className="text-sm text-gray-500">No active recommendations</p>
        ) : (
          aiRecommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className={`border-l-4 ${severityColors[rec.severity]} rounded-lg p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="mt-1 text-sm">{rec.message}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(rec.timestamp).toLocaleString('th-TH')}
                  </p>
                </div>
                {rec.location && (
                  <MapPin className="h-5 w-5 flex-shrink-0 text-gray-400" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RiskHeatmapPreview: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative h-80 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg transition-all hover:shadow-2xl"
    >
      {/* Placeholder Map Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold">Flood Risk Heatmap</h3>
        <p className="mt-1 text-sm text-gray-200">Click to view full map</p>

        <button className="mt-4 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm transition-all group-hover:bg-white/30">
          <span className="font-semibold">Open Map View</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Stats Overlay */}
      <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-3 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-lg font-bold">12 Districts</span>
        </div>
        <p className="text-xs text-gray-600">High Risk Areas</p>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const ExecutiveDashboard: React.FC = () => {
  const router = useRouter();
  const {
    systemStatus,
    predictedRainfall24h,
    peopleAtRisk,
    buildingsAffected,
    roadsBlocked,
    waterLevelForecast,
    districtRisks,
    isLoading,
    fetchDashboardData,
  } = useDashboardStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Prepare chart data
  const districtRiskChartData = [
    {
      name: 'Safe',
      value: districtRisks.filter((d) => d.riskLevel === 'low').length,
      color: '#10B981',
    },
    {
      name: 'Medium Risk',
      value: districtRisks.filter((d) => d.riskLevel === 'medium').length,
      color: '#F59E0B',
    },
    {
      name: 'High Risk',
      value: districtRisks.filter((d) => d.riskLevel === 'high').length,
      color: '#EF4444',
    },
    {
      name: 'Critical',
      value: districtRisks.filter((d) => d.riskLevel === 'critical').length,
      color: '#DC2626',
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Klaew Klad</h1>
                <p className="text-xs text-gray-500">Digital Twin Flood Warning System</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1">
              <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                Overview
              </button>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                Flood Analysis
              </button>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                Evacuation Status
              </button>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                Sensor Health
              </button>
            </div>

            {/* Action Button */}
            <button
              onClick={() => router.push('/map')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              <MapPin className="h-5 w-5" />
              Go to Map Operation
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Status Cards Row */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="System Status"
            value={systemStatus.toUpperCase()}
            subtitle="Last updated: Just now"
            icon={<Activity />}
            status={systemStatus}
          />

          <StatusCard
            title="Predicted Rainfall (24h)"
            value={`${predictedRainfall24h} mm`}
            subtitle="Huawei ModelArts Forecast"
            icon={<CloudRain />}
            status={predictedRainfall24h > 100 ? 'critical' : predictedRainfall24h > 50 ? 'alert' : 'normal'}
            trend={{ value: 15, direction: 'up' }}
          />

          <StatusCard
            title="People at Risk"
            value={peopleAtRisk.toLocaleString()}
            subtitle={`${buildingsAffected} buildings affected`}
            icon={<Users />}
            status={peopleAtRisk > 10000 ? 'critical' : peopleAtRisk > 5000 ? 'alert' : 'normal'}
          />

          <StatusCard
            title="Roads Blocked"
            value={roadsBlocked}
            subtitle="Emergency routes monitored"
            icon={<Shield />}
            status={roadsBlocked > 10 ? 'critical' : roadsBlocked > 5 ? 'alert' : 'normal'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="space-y-8 lg:col-span-2">
            {/* Water Level Forecast Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Water Level Forecast - U-Tapao Canal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={waterLevelForecast}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                    stroke="#6B7280"
                  />
                  <YAxis
                    label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }}
                    stroke="#6B7280"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    name="Actual"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorPredicted)"
                    name="Predicted"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* District Risk Assessment Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                District Risk Assessment
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={districtRiskChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {districtRiskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Risk Heatmap Preview */}
            <RiskHeatmapPreview onClick={() => router.push('/map')} />

            {/* AI Insights Panel */}
            <AIInsightsPanel />
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-xl bg-white p-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <span className="text-lg font-semibold text-gray-900">Loading dashboard...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;
