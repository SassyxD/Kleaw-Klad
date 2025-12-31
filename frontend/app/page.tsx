'use client';

import { useRouter } from 'next/navigation';
import { Waves, BarChart3, Map, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Waves className="h-12 w-12" />
            </div>
          </div>

          <h1 className="text-6xl font-bold mb-4">Klaew Klad</h1>
          <p className="text-2xl mb-2">Digital Twin Flood Warning System</p>
          <p className="text-lg opacity-90">Powered by Huawei MindSpore AI</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Executive Dashboard Card */}
          <div
            onClick={() => router.push('/dashboard')}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 cursor-pointer hover:bg-white/20 transition-all border border-white/20 hover:scale-105"
          >
            <BarChart3 className="h-12 w-12 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Executive Dashboard</h2>
            <p className="text-white/80 mb-6">
              High-level overview for decision makers. View system status, predictions, and AI recommendations.
            </p>
            <div className="flex items-center text-white font-semibold">
              <span>View Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>

          {/* Operation Map Card */}
          <div
            onClick={() => router.push('/map')}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 cursor-pointer hover:bg-white/20 transition-all border border-white/20 hover:scale-105"
          >
            <Map className="h-12 w-12 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Operation Map</h2>
            <p className="text-white/80 mb-6">
              Real-time flood monitoring and evacuation planning. Powered by SAR de-clouding and GNN risk analysis.
            </p>
            <div className="flex items-center text-white font-semibold">
              <span>Open Map</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 text-center text-white">
          <h3 className="text-xl font-semibold mb-8">Powered by Advanced AI</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
              <span>CycleGAN De-clouding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
              <span>GNN Risk Propagation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
              <span>RL Evacuation Routing</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/60 text-sm">
          <p>Huawei ICT Innovation Competition 2024</p>
          <p className="mt-2">Hat Yai, Songkhla, Thailand</p>
        </div>
      </div>
    </div>
  );
}
