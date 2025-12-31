'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'operator' | 'viewer'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@klaewklad.th': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'ผู้ดูแลระบบ',
      email: 'admin@klaewklad.th',
      role: 'admin',
    },
  },
  'operator@klaewklad.th': {
    password: 'operator123',
    user: {
      id: '2',
      name: 'เจ้าหน้าที่ปฏิบัติการ',
      email: 'operator@klaewklad.th',
      role: 'operator',
    },
  },
  'demo@klaewklad.th': {
    password: 'demo',
    user: {
      id: '3',
      name: 'Demo User',
      email: 'demo@klaewklad.th',
      role: 'viewer',
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser = mockUsers[email.toLowerCase()]
    
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user)
      setIsLoading(false)
      setShowLoginModal(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    showLoginModal,
    setShowLoginModal,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
