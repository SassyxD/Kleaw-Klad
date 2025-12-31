'use client'

import React, { useState } from 'react'
import { X, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, isLoading } = useAuth()
  const { language } = useLanguage()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError(language === 'th' ? 'กรุณากรอกอีเมลและรหัสผ่าน' : 'Please enter email and password')
      return
    }
    
    const success = await login(email, password)
    if (!success) {
      setError(language === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : 'Invalid email or password')
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    await login(demoEmail, demoPassword)
  }

  if (!showLoginModal) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm fade-in"
        onClick={() => setShowLoginModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}
              </h2>
              <p className="text-primary-100 text-sm mt-1">
                {language === 'th' 
                  ? 'Klaew Klad - Hat Yai Flood Digital Twin' 
                  : 'Klaew Klad - Hat Yai Flood Digital Twin'}
              </p>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 btn-press hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 stagger-children">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm bounce-subtle">
              <AlertCircle className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {language === 'th' ? 'อีเมล' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'th' ? 'กรอกอีเมลของคุณ' : 'Enter your email'}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {language === 'th' ? 'รหัสผ่าน' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'th' ? 'กรอกรหัสผ่าน' : 'Enter your password'}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                {language === 'th' ? 'จดจำการเข้าสู่ระบบ' : 'Remember me'}
              </span>
            </label>
            <button 
              type="button" 
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              {language === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot password?'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-3 rounded-xl font-medium text-white transition-all duration-200 btn-press",
              isLoading
                ? "bg-primary-400 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Logging in...'}
              </span>
            ) : (
              language === 'th' ? 'เข้าสู่ระบบ' : 'Login'
            )}
          </button>

          {/* Demo Accounts */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center mb-3">
              {language === 'th' ? 'บัญชีสาธิต:' : 'Demo Accounts:'}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@klaewklad.th', 'admin123')}
                className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-all duration-200 text-left btn-press hover:shadow-sm hover:-translate-y-0.5"
              >
                <span className="font-medium">Admin:</span> admin@klaewklad.th / admin123
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('demo@klaewklad.th', 'demo')}
                className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-all duration-200 text-left btn-press hover:shadow-sm hover:-translate-y-0.5"
              >
                <span className="font-medium">Demo:</span> demo@klaewklad.th / demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
