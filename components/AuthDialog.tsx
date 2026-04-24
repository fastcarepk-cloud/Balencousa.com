"use client"

import { Label } from "@/components/ui/label"

import type React from "react"
import { useState } from "react"
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import {
  registerUser,
  loginUser,
  autoLoginAfterRegistration,
  getUserProfile,
  type RegisterUserData,
  type LoginCredentials,
} from "@/lib/wordpress-api"

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [info, setInfo] = useState("")

  const auth = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    marketingConsent: false,
    rememberMe: false,
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
    setInfo("")
  }

  const validateForm = () => {
    if (activeTab === "signup") {
      if (!formData.firstName.trim()) return "First name is required"
      if (!formData.lastName.trim()) return "Last name is required"
      if (!formData.phone.trim()) return "Phone number is required"
      if (!formData.address.trim()) return "Address is required"
      if (!formData.city.trim()) return "City is required"
      if (formData.password !== formData.confirmPassword) return "Passwords do not match"
      if (formData.password.length < 6) return "Password must be at least 6 characters"
      if (!formData.agreeToTerms) return "You must agree to the terms and conditions"
    }

    if (!formData.email.trim()) return "Email is required"
    if (!formData.password.trim()) return "Password is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setInfo("")

    try {
      if (activeTab === "signup") {
        setInfo("📝 Creating your account...")
        const userData: RegisterUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          password: formData.password,
          agreeToTerms: formData.agreeToTerms,
          marketingConsent: formData.marketingConsent,
        }

        await registerUser(userData)
        setSuccess("🎉 Account created successfully! Logging you in...")
        setInfo("🔐 Logging you in...")

        const loginResponse = await autoLoginAfterRegistration(formData.email, formData.password)

        if (loginResponse) {
          const freshProfile = await getUserProfile(loginResponse.token)
          if (freshProfile) {
            auth.login(loginResponse.token, freshProfile)

            const storage = formData.rememberMe ? localStorage : sessionStorage
            storage.setItem("glamup_token", loginResponse.token)
            storage.setItem("glamup_user", JSON.stringify(freshProfile))

            setSuccess(`🎉 Welcome, ${freshProfile.firstName}!`)
            setInfo("")

            setTimeout(() => onOpenChange(false), 2000)
          } else {
            throw new Error("Could not fetch user profile after registration.")
          }
        } else {
          setError("Account created, but auto-login failed. Please sign in manually.")
          setActiveTab("signin")
        }
      } else {
        // Login process
        setInfo("🔐 Signing you in...")
        const credentials: LoginCredentials = {
          username: formData.email,
          password: formData.password,
        }

        const loginResponse = await loginUser(credentials)
        const freshProfile = await getUserProfile(loginResponse.token)

        if (freshProfile) {
          auth.login(loginResponse.token, freshProfile)

          const storage = formData.rememberMe ? localStorage : sessionStorage
          storage.setItem("glamup_token", loginResponse.token)
          storage.setItem("glamup_user", JSON.stringify(freshProfile))

          setSuccess(`🎉 Welcome back, ${freshProfile.firstName}!`)
          setInfo("")

          setTimeout(() => onOpenChange(false), 2000)
        } else {
          throw new Error("Could not fetch user profile after login.")
        }
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.")
      setInfo("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to GlamUp</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 px-6 text-md font-medium transition-colors ${
              activeTab === "signin"
                ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 px-6 text-md font-medium transition-colors ${
              activeTab === "signup"
                ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-800">{success}</span>
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-blue-800">{info}</span>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="DHA Phase 2"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Islamabad"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-xs text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-pink-600 hover:underline" rel="noreferrer">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-pink-600 hover:underline" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  disabled={!formData.agreeToTerms || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </>
            )}

            {activeTab === "signin" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", !!checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-pink-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
