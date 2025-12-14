'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { 
  Home,
  Map, 
  AlertCircle, 
  Navigation,
  Info,
  LogOut,
  Droplets,
  MapPin
} from 'lucide-react';

export default function ClientPortal() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Klaew Klad</h1>
                <p className="text-sm text-blue-100">Hat Yai Flood Status</p>
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              <strong>Flood Warning:</strong> U-Tapao Canal water level rising. Stay alert.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat
            icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
            label="Current Status"
            value="Warning"
            color="text-orange-600"
          />
          <QuickStat
            icon={<MapPin className="h-6 w-6 text-green-600" />}
            label="Open Shelters"
            value="8"
            color="text-green-600"
          />
          <QuickStat
            icon={<Map className="h-6 w-6 text-blue-600" />}
            label="Affected Areas"
            value="12"
            color="text-blue-600"
          />
          <QuickStat
            icon={<Navigation className="h-6 w-6 text-purple-600" />}
            label="Safe Routes"
            value="Active"
            color="text-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Flood Map */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Flood Map</h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive flood map</p>
                <p className="text-sm text-gray-500 mt-2">Real-time water levels and affected areas</p>
              </div>
            </div>
          </div>

          {/* Nearest Shelter */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              Nearest Shelter
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">Prince of Songkla University Gym</p>
                <p className="text-sm text-gray-600 mt-1">2.3 km away • 15 min walk</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">234 / 500</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Open
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Get Directions
              </button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-600" />
              Safety Tips
            </h2>
            <ul className="space-y-3">
              <SafetyTip text="Move to higher ground immediately if water rises" />
              <SafetyTip text="Avoid walking through flood water" />
              <SafetyTip text="Keep emergency supplies ready" />
              <SafetyTip text="Stay informed through official channels" />
              <SafetyTip text="Do not drive through flooded roads" />
            </ul>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Alerts</h2>
          <div className="space-y-3">
            <PublicAlert
              severity="warning"
              title="U-Tapao Canal Water Level Rising"
              message="Water level at U-Tapao Canal is rising. Residents in Zone A should prepare for potential evacuation."
              time="1 hour ago"
            />
            <PublicAlert
              severity="info"
              title="Shelter Capacity Update"
              message="PSU Gym shelter now at 47% capacity. Additional shelters standing by."
              time="3 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function SafetyTip({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <div className="h-2 w-2 rounded-full bg-blue-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

function PublicAlert({ severity, title, message, time }: { severity: string; title: string; message: string; time: string }) {
  const colors = {
    warning: 'bg-orange-50 border-orange-200 text-orange-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity as keyof typeof colors]}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs opacity-75">{time}</span>
      </div>
      <p className="text-sm opacity-90">{message}</p>
    </div>
  );
}
