"use client"

import { useEffect, useState } from "react"
import LoadingSpinner from "./LoadingSpinner"

interface BookingLoaderProps {
  serviceName?: string
}

export default function BookingLoader({ serviceName }: BookingLoaderProps) {
  const [loadingText, setLoadingText] = useState("Preparing your booking...")

  useEffect(() => {
    const texts = [
      "Preparing your booking...",
      "Loading service details...",
      "Setting up your appointment...",
      "Almost ready...",
    ]

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="absolute -inset-4 border-2 border-pink-200 rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {serviceName ? `Booking ${serviceName}` : "Preparing Your Booking"}
          </h2>
          <p className="text-gray-600 animate-pulse">{loadingText}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
