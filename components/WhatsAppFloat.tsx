"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const headerHeight = 80 // Approximate header height
      const threshold = headerHeight + window.innerHeight * 0.1 // 10% after header
      setIsVisible(scrolled > threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in booking a beauty service. Can you help me?")
    const phoneNumber = "923265338779" // Updated Pakistani WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  if (!isVisible) return null

  return (
    <div className="fixed left-4 bottom-20 z-50">
      {/* Expanded Chat Box */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">GlamUp Beauty</h4>
                <p className="text-xs text-green-500">Online now</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setIsExpanded(false)} className="p-1 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Hi! 👋 Need help booking a beauty service? Chat with us on WhatsApp!
          </p>
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm"
            style={{ minHeight: "44px" }}
          >
            Start Chat on WhatsApp
          </Button>
        </div>
      )}

      {/* WhatsApp Float Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg animate-bounce"
        style={{ minWidth: "60px", minHeight: "60px" }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  )
}
