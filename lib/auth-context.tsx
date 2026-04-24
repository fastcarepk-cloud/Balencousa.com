"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { validateToken, getUserProfile, type UserProfile } from "./wordpress-api"

interface AuthContextType {
user: UserProfile | null
token: string | null
isLoading: boolean
login: (token: string, user: UserProfile) => void
logout: () => void
updateUser: (user: UserProfile) => void
isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<UserProfile | null>(null)
const [token, setToken] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState(true)

const logout = useCallback(() => {
  setToken(null)
  setUser(null)
  localStorage.removeItem("glamup_token")
  localStorage.removeItem("glamup_user")
  sessionStorage.removeItem("glamup_token")
  sessionStorage.removeItem("glamup_user")
}, [])

useEffect(() => {
  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("glamup_token") || sessionStorage.getItem("glamup_token")
      if (storedToken) {
        const isValid = await validateToken(storedToken)
        if (isValid) {
          const freshProfile = await getUserProfile(storedToken)
          if (freshProfile) {
            setToken(storedToken)
            setUser(freshProfile)
            const storage = localStorage.getItem("glamup_token") ? localStorage : sessionStorage
            storage.setItem("glamup_user", JSON.stringify(freshProfile))
          } else {
            logout()
          }
        } else {
          logout()
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  checkAuth()
}, [logout])

const login = useCallback((newToken: string, newUser: UserProfile) => {
  setToken(newToken)
  setUser(newUser)
}, [])

const updateUser = useCallback((updatedUser: UserProfile) => {
  setUser(updatedUser)
  const storage = localStorage.getItem("glamup_token") ? localStorage : sessionStorage
  if (storage.getItem("glamup_user")) {
    storage.setItem("glamup_user", JSON.stringify(updatedUser))
  }
}, [])

const value: AuthContextType = {
  user,
  token,
  isLoading,
  login,
  logout,
  updateUser,
  isAuthenticated: !!user && !!token,
}

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
const context = useContext(AuthContext)
if (context === undefined) {
  throw new Error("useAuth must be used within an AuthProvider")
}
return context
}
