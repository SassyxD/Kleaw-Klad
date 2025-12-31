'use client'

import React from 'react'

export default function MapLegend() {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 min-w-[180px]">
      <h3 className="text-sm font-semibold text-navy-800 mb-3">คำอธิบาย</h3>
      
      {/* Water Depth Legend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">ระดับน้ำท่วม</p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1565C0', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">สูง (&gt;1.5 ม.)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1E88E5', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">ปานกลาง (0.5-1.5 ม.)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#42A5F5', opacity: 0.7 }} />
            <span className="text-xs text-gray-700">ต่ำ (&lt;0.5 ม.)</span>
          </div>
        </div>
      </div>

      {/* Evacuation Routes Legend */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">เส้นทางอพยพ</p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs text-gray-700">ปกติ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs text-gray-700">เสี่ยง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#EF4444', borderStyle: 'dashed' }} />
            <span className="text-xs text-gray-700">ปิด</span>
          </div>
        </div>
      </div>

      {/* Facilities Legend */}
      <div>
        <p className="text-xs text-gray-500 mb-2">จุดสำคัญ</p>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-danger-500" />
            <span className="text-xs text-gray-700">โรงพยาบาล</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning-500" />
            <span className="text-xs text-gray-700">สถานีไฟฟ้า</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-xs text-gray-700">โรงเรียน</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-xs text-gray-700">ศูนย์พักพิง</span>
          </div>
        </div>
      </div>
    </div>
  )
}
