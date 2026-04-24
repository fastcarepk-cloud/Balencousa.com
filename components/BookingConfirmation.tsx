"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingConfirmationProps {
  orderDetails: {
    orderId: string
    serviceName: string
    customerName: string
    total: number
    status: string
    appointmentDate?: string
    appointmentTime?: string
    specialInstructions?: string
  }
  onClose: () => void
}

export default function BookingConfirmation({ orderDetails, onClose }: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Booking Confirmed!</CardTitle>
          <p className="text-gray-600">
            Your booking has been successfully submitted. You will receive a confirmation call shortly.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{orderDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{orderDetails.customerName}</span>
              </div>
              {orderDetails.appointmentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(orderDetails.appointmentDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {orderDetails.appointmentTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{orderDetails.appointmentTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-pink-500">RS {orderDetails.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-yellow-600">{orderDetails.status}</span>
              </div>
            </div>
          </div>

          {orderDetails.specialInstructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-1 text-sm">Special Instructions</h4>
              <p className="text-xs text-blue-700">{orderDetails.specialInstructions}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-1 text-sm">What's Next?</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Our team will call you within 30 minutes to confirm your appointment</li>
              <li>• You'll receive an SMS with beautician details and arrival time</li>
              <li>• Payment will be collected after service completion</li>
              {orderDetails.appointmentDate && orderDetails.appointmentTime && (
                <li>• Please be available at your scheduled time: {orderDetails.appointmentTime}</li>
              )}
            </ul>
          </div>

          <Button onClick={onClose} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
