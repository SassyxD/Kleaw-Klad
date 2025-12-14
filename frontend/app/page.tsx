import Link from 'next/link';
import { Droplets, Shield, Map, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Klaew Klad</span>
          </div>
          <Link 
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Satellite-Driven Flood Forecasting
            <span className="block text-blue-600 mt-2">for Hat Yai</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered digital twin system providing real-time flood monitoring, 
            risk assessment, and strategic evacuation planning
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/client"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Public Portal
            </Link>
            <Link 
              href="/operator"
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-semibold"
            >
              Operator Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Map className="h-12 w-12 text-blue-600" />}
            title="Digital Twin"
            description="Real-time 3D visualization of Hat Yai with live flood data integration"
          />
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-green-600" />}
            title="Risk Assessment"
            description="GNN-powered infrastructure risk propagation and cascade prediction"
          />
          <FeatureCard
            icon={<Droplets className="h-12 w-12 text-cyan-600" />}
            title="SAR Translation"
            description="Cloud-penetrating vision using CycleGAN for continuous monitoring"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-purple-600" />}
            title="Smart Evacuation"
            description="RL-based dynamic routing for optimal evacuation planning"
          />
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <StatCard number="35s" label="Processing Time (50km²)" />
          <StatCard number="92.5%" label="Flood Segmentation IoU" />
          <StatCard number="2h" label="Early Warning Window" />
        </div>

        {/* Technology */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <TechBadge>Huawei MindSpore</TechBadge>
            <TechBadge>ModelArts</TechBadge>
            <TechBadge>CANN</TechBadge>
            <TechBadge>Graph Neural Networks</TechBadge>
            <TechBadge>Reinforcement Learning</TechBadge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 Klaew Klad. Disaster Management for Southern Thailand.</p>
          <p className="mt-2 text-sm">Huawei MindSpore AI Innovation Competition</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="p-6 bg-blue-50 rounded-xl">
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-700">{label}</div>
    </div>
  );
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
      {children}
    </span>
  );
}
