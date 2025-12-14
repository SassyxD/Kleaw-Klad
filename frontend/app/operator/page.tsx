'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Users, 
  Settings, 
  LogOut,
  Droplets
} from 'lucide-react';

export default function OperatorDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">Klaew Klad Operator Dashboard</h1>
              <p className="text-sm text-gray-400">Emergency Operations Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-2">
            <NavItem icon={<LayoutDashboard />} label="Overview" active />
            <NavItem icon={<Map />} label="Flood Map" />
            <NavItem icon={<AlertTriangle />} label="Risk Assessment" />
            <NavItem icon={<Users />} label="Evacuation" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Active Alerts"
              value="3"
              change="+2 from yesterday"
              color="text-red-600"
            />
            <StatsCard
              title="Affected Population"
              value="45,000"
              change="U-Tapao Basin"
              color="text-orange-600"
            />
            <StatsCard
              title="Open Shelters"
              value="8/12"
              change="67% capacity"
              color="text-green-600"
            />
            <StatsCard
              title="Blocked Roads"
              value="23"
              change="6 critical routes"
              color="text-blue-600"
            />
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Flood Map</h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will be integrated here</p>
                <p className="text-sm text-gray-500 mt-2">Mapbox GL / Leaflet with real-time flood layers</p>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              <AlertItem
                severity="critical"
                title="Flash Flood Warning - Zone A"
                time="15 minutes ago"
              />
              <AlertItem
                severity="warning"
                title="U-Tapao Canal Water Level Rising"
                time="1 hour ago"
              />
              <AlertItem
                severity="info"
                title="Shelter #3 Activated"
                time="2 hours ago"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="h-5 w-5">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatsCard({ title, value, change, color }: { title: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-gray-500">{change}</p>
    </div>
  );
}

function AlertItem({ severity, title, time }: { severity: string; title: string; time: string }) {
  const colors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity as keyof typeof colors]}`}>
      <div className="flex justify-between items-start">
        <p className="font-medium">{title}</p>
        <span className="text-xs">{time}</span>
      </div>
    </div>
  );
}
