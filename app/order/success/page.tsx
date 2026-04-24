"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, Clock, Phone, Mail, Copy, Share2, MessageCircle, Star, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"

interface BookingDetails {
  orderId: number
  orderNumber: string
  serviceName: string
  total: number
  customerName: string
  email: string
  phone: string
  appointmentDate: string
  appointmentTime: string
  selectedAddOns: Array<{
    name: string
    price: number
  }>
}

export default function OrderSuccessPage() {
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [copySuccess, setCopySuccess] = useState("")
  const [shareError, setShareError] = useState("")

  useEffect(() => {
    // Get booking details from session storage
    const storedData = sessionStorage.getItem("bookingSuccess")
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setBookingDetails(data)
      } catch (error) {
        console.error("Error parsing booking data:", error)
        // Set mock data for demonstration
        setBookingDetails({
          orderId: 12345,
          orderNumber: "GU00162",
          serviceName: "Hair Protein Treatment",
          total: 2049,
          customerName: "Sapphire RSS",
          email: "info@sapphirerings.org",
          phone: "03473579448",
          appointmentDate: "2025-07-31",
          appointmentTime: "10:00 AM",
          selectedAddOns: [],
        })
      }
    } else {
      // Set mock data if no session storage
      setBookingDetails({
        orderId: 12345,
        orderNumber: "GU00162",
        serviceName: "Hair Protein Treatment",
        total: 2049,
        customerName: "Sapphire RSS",
        email: "info@sapphirerings.org",
        phone: "03473579448",
        appointmentDate: "2025-07-31",
        appointmentTime: "10:00 AM",
        selectedAddOns: [],
      })
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(`${type} copied to clipboard!`)
      setTimeout(() => setCopySuccess(""), 3000)
    } catch (error) {
      console.error("Failed to copy:", error)
      setCopySuccess("Failed to copy. Please try again.")
      setTimeout(() => setCopySuccess(""), 3000)
    }
  }

  const shareBooking = async () => {
    if (!bookingDetails) return

    const shareText = `🎉 Booking Confirmed!

Service: ${bookingDetails.serviceName}
Date: ${formatDate(bookingDetails.appointmentDate)}
Time: ${bookingDetails.appointmentTime}
Order #: ${bookingDetails.orderNumber}
Total: RS ${bookingDetails.total}

Thank you for choosing our salon! 💄✨`

    try {
      // Check if Web Share API is supported and can share text
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: "Salon Booking Confirmation",
          text: shareText,
        })
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(shareText, "Booking details")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      setShareError("Sharing not available. Details copied to clipboard instead.")
      await copyToClipboard(shareText, "Booking details")
      setTimeout(() => setShareError(""), 3000)
    }
  }

  const shareWhatsApp = () => {
    if (!bookingDetails) return

    const message = `🎉 My salon booking is confirmed!

Service: ${bookingDetails.serviceName}
Date: ${formatDate(bookingDetails.appointmentDate)}
Time: ${bookingDetails.appointmentTime}
Order #: ${bookingDetails.orderNumber}
Total: RS ${bookingDetails.total}

Can't wait! 💄✨`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareEmail = () => {
    if (!bookingDetails) return

    const subject = "Salon Booking Confirmation"
    const body = `Hi!

I wanted to share my salon booking confirmation with you:

Service: ${bookingDetails.serviceName}
Date: ${formatDate(bookingDetails.appointmentDate)}
Time: ${bookingDetails.appointmentTime}
Order Number: ${bookingDetails.orderNumber}
Total Amount: RS ${bookingDetails.total}

Looking forward to my appointment!

Best regards,
${bookingDetails.customerName}`

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you, {bookingDetails.customerName}! Your appointment has been successfully booked.
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800">
            Order #{bookingDetails.orderNumber}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details Card */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Service</p>
                        <p className="text-lg font-semibold text-gray-900">{bookingDetails.serviceName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(bookingDetails.appointmentDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Time</p>
                        <p className="text-lg font-semibold text-gray-900">{bookingDetails.appointmentTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{bookingDetails.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">{bookingDetails.phone}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg">
                      <p className="text-sm font-medium opacity-90">Total Amount</p>
                      <p className="text-3xl font-bold">RS {bookingDetails.total}</p>
                    </div>
                  </div>
                </div>

                {bookingDetails.selectedAddOns && bookingDetails.selectedAddOns.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected Add-ons:</h4>
                    <div className="space-y-2">
                      {bookingDetails.selectedAddOns.map((addon, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{addon.name}</span>
                          <span className="font-semibold text-gray-900">+RS {addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sharing Options */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={shareBooking}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                  >
                    <Share2 className="w-6 h-6 text-blue-600" />
                    <span className="text-sm">Share</span>
                  </Button>

                  <Button
                    onClick={shareWhatsApp}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-green-50 hover:border-green-300 bg-transparent"
                  >
                    <MessageCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm">WhatsApp</span>
                  </Button>

                  <Button
                    onClick={shareEmail}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                  >
                    <Mail className="w-6 h-6 text-purple-600" />
                    <span className="text-sm">Email</span>
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(bookingDetails.orderNumber, "Order number")}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4 hover:bg-gray-50 hover:border-gray-300"
                  >
                    <Copy className="w-6 h-6 text-gray-600" />
                    <span className="text-sm">Copy ID</span>
                  </Button>
                </div>

                {copySuccess && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">{copySuccess}</p>
                  </div>
                )}

                {shareError && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">{shareError}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Confirmation Timer */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmation Call</h3>
                <p className="text-sm text-gray-600 mb-4">You'll receive a confirmation call within:</p>
                <div className="text-3xl font-bold text-orange-600 mb-2">{formatTime(timeRemaining)}</div>
                <p className="text-xs text-gray-500">Please keep your phone available</p>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmation Call</p>
                    <p className="text-sm text-gray-600">
                      We'll call you within 30 minutes to confirm your appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Prepare for Your Visit</p>
                    <p className="text-sm text-gray-600">Arrive 10 minutes early and bring a valid ID</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Enjoy Your Service</p>
                    <p className="text-sm text-gray-600">Relax and let our experts take care of you</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/categories" className="block">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Another Service
                  </Button>
                </Link>

                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.open("tel:+923001234567", "_self")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Rating Prompt */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Love Our Service?</h3>
                <p className="text-sm text-gray-600 mb-4">Share your experience and help others discover our salon</p>
                <Button size="sm" variant="outline" className="border-yellow-300 hover:bg-yellow-50 bg-transparent">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
