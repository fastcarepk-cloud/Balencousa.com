"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Package, User, Phone, RefreshCw, AlertCircle, Star, Send, X } from 'lucide-react'
import LoadingSpinner from "./LoadingSpinner"
import Link from "next/link"

interface BookingItem {
  id: number
  name: string
  quantity: number
  price: number
  total: number
  productId?: number
}

interface Booking {
  id: number
  orderNumber: string
  status: string
  date: string
  time?: string
  total: number
  items: BookingItem[]
  customerName: string
  customerEmail: string
  customerPhone?: string
  billingAddress?: {
    address_1?: string
    city?: string
    state?: string
    postcode?: string
  }
  shippingAddress?: {
    address_1?: string
    city?: string
    state?: string
    postcode?: string
  }
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  "on-hold": "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Confirmed",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
}

export default function BookingHistory() {
  const { user, token, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Review UI state
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<{ productId: number; productName: string } | null>(null)
  const [reviewName, setReviewName] = useState("")
  const [reviewEmail, setReviewEmail] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState("")

  // Track which productIds have a review by this user
  const [reviewed, setReviewed] = useState<Set<number>>(new Set())

  const fetchBookings = async () => {
    if (!user || !token) {
      setLoading(false)
      setError("Please log in to view your bookings")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("=== FETCHING BOOKINGS ===")
      console.log("User email:", user.email)
      
      const response = await fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        if (response.status === 401) {
          logout()
          setError("Your session has expired. Please log in again.")
          return
        }
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("=== BOOKING DATA RECEIVED ===")
      console.log("Orders count:", data.orders?.length || 0)
      
      setBookings((data.orders || []) as Booking[])
      setDebugInfo(data.debug)

      // After orders load, fetch which products already have reviews by this email
      const allProductIds = new Set<number>()
      ;(data.orders || []).forEach((o: Booking) => {
        o.items?.forEach((it: BookingItem) => {
          if (typeof it.productId === "number" && it.productId > 0) {
            allProductIds.add(it.productId)
          }
        })
      })
      
      console.log("=== CHECKING EXISTING REVIEWS ===")
      console.log("Product IDs to check:", Array.from(allProductIds))
      
      if (allProductIds.size > 0 && user?.email) {
        try {
          const checkRes = await fetch(
            `/api/woocommerce/reviews?email=${encodeURIComponent(user.email)}&productIds=${Array.from(allProductIds).join(",")}`,
            { cache: "no-store" },
          )
          if (checkRes.ok) {
            const reviewData = await checkRes.json()
            console.log("Review check response:", reviewData)
            const ids = Array.isArray(reviewData?.reviewed) ? (reviewData.reviewed as number[]) : []
            setReviewed(new Set(ids))
            console.log("Already reviewed product IDs:", ids)
          } else {
            console.warn("Failed to check existing reviews:", checkRes.status)
          }
        } catch (reviewError) {
          console.error("Error checking reviews:", reviewError)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bookings"
      console.error("=== BOOKING FETCH ERROR ===", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    setReviewName(user?.name || "")
    setReviewEmail(user?.email || "")
  }, [user, token])

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeFilter === "all") return true
      if (activeFilter === "pending") return booking.status === "pending"
      if (activeFilter === "confirmed") return booking.status === "processing"
      if (activeFilter === "completed") return booking.status === "completed"
      if (activeFilter === "cancelled") return booking.status === "cancelled"
      return true
    })
  }, [bookings, activeFilter])

  const openReview = (productId?: number, productName?: string) => {
    if (!productId) return
    console.log("=== OPENING REVIEW MODAL ===")
    console.log("Product ID:", productId)
    console.log("Product Name:", productName)
    
    setReviewTarget({ productId, productName: productName || "Service" })
    setReviewText("")
    setReviewRating(5)
    setHoverRating(0)
    setReviewMessage("")
    setReviewOpen(true)
  }

  const submitReview = async () => {
    if (!reviewTarget) return
    setReviewSubmitting(true)
    setReviewMessage("")

    try {
      console.log("=== SUBMITTING REVIEW ===")
      console.log("Product ID:", reviewTarget.productId)
      console.log("Rating:", reviewRating)
      
      const res = await fetch("/api/woocommerce/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: reviewTarget.productId,
          reviewer: reviewName || "Customer",
          reviewer_email: reviewEmail,
          review: reviewText,
          rating: reviewRating,
        }),
      })
      const result = await res.json()
      console.log("Review submission result:", result)

      if (result?.success) {
        // Mark as reviewed regardless of pending/approved to avoid duplicates
        setReviewed((prev) => new Set([...prev, reviewTarget.productId]))
        setReviewMessage(
          result?.pending 
            ? "Thank you! Your review has been submitted and will appear after admin approval." 
            : "Thank you! Your review has been submitted successfully."
        )
        // Close modal after 2 seconds to show the success message
        setTimeout(() => {
          setReviewOpen(false)
          setReviewMessage("")
        }, 2000)
      } else {
        setReviewMessage(result?.error || "Failed to submit review. Please try again.")
      }
    } catch (error) {
      console.error("=== REVIEW SUBMISSION ERROR ===", error)
      setReviewMessage("Network error. Please try again.")
    } finally {
      setReviewSubmitting(false)
    }
  }

  // Logged-out state
  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Please Log In</h3>
          <p className="text-gray-500 mb-6">You need to be logged in to view your booking history.</p>
          <Button className="bg-pink-500 hover:bg-pink-600">Log In</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-red-500 mb-4">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Error Loading Bookings</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            {debugInfo && (
              <details className="mt-4 text-xs text-left bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer font-medium">Debug Info</summary>
                <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={fetchBookings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            {error.includes("session has expired") && (
              <Button className="bg-pink-500 hover:bg-pink-600">Log In Again</Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Booking History</h2>
          <p className="text-gray-500">View and manage your service bookings</p>
          {debugInfo?.counts?.merged != null && (
            <p className="text-xs text-gray-400 mt-1">
              Found {debugInfo.counts.merged} orders
              {debugInfo.customerId && ` (Customer ID: ${debugInfo.customerId})`}
            </p>
          )}
        </div>
        <Button onClick={fetchBookings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
            className={activeFilter === filter.key ? "bg-pink-500 hover:bg-pink-600" : ""}
          >
            {filter.label}
            {filter.key !== "all" && (
              <span className="ml-1 text-xs">
                (
                {
                  bookings.filter((b) => {
                    if (filter.key === "pending") return b.status === "pending"
                    if (filter.key === "confirmed") return b.status === "processing"
                    if (filter.key === "completed") return b.status === "completed"
                    if (filter.key === "cancelled") return b.status === "cancelled"
                    return false
                  }).length
                }
                )
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Orders list */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "all" ? "You haven't made any bookings yet." : `No ${activeFilter} bookings found.`}
            </p>
            <Link href="/categories">
              <Button className="bg-pink-500 hover:bg-pink-600">Book a Service</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Order #{booking.orderNumber}
                      {booking.status === "completed" && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                          <Star className="w-3 h-3 mr-1" />
                          Can Review
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      {booking.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[booking.status] || "bg-gray-100 text-gray-800"}>
                      {statusLabels[booking.status] || booking.status}
                    </Badge>
                    <div className="text-right">
                      <div className="font-semibold">Rs. {booking.total.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Services/Items */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Services:</h4>
                    <div className="space-y-2">
                      {booking.items.map((item) => {
                        const pid = item.productId
                        const canReview = booking.status === "completed" && typeof pid === "number" && pid > 0
                        const alreadyReviewed = pid ? reviewed.has(pid) : false
                        
                        console.log(`Item ${item.name}: productId=${pid}, canReview=${canReview}, alreadyReviewed=${alreadyReviewed}`)
                        
                        return (
                          <div key={`${booking.id}-${item.id}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">
                                {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Rs. {item.total.toLocaleString()}
                                {pid && <span className="ml-2 text-xs text-gray-400">(ID: {pid})</span>}
                              </div>
                              {alreadyReviewed && (
                                <div className="flex items-center gap-1 mt-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-xs text-green-600 font-medium ml-2">Review submitted</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {canReview && (
                                <Button
                                  size="sm"
                                  variant={alreadyReviewed ? "outline" : "default"}
                                  className={
                                    alreadyReviewed 
                                      ? "border-green-200 text-green-600 cursor-not-allowed" 
                                      : "bg-pink-500 hover:bg-pink-600 text-white"
                                  }
                                  onClick={() => !alreadyReviewed && openReview(pid, item.name)}
                                  disabled={alreadyReviewed}
                                >
                                  <Star className="w-4 h-4 mr-1" />
                                  {alreadyReviewed ? "Reviewed" : "Leave Review"}
                                </Button>
                              )}
                              {!canReview && pid && (
                                <span className="text-xs text-gray-400">
                                  {booking.status !== "completed" ? "Complete order to review" : "No product ID"}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Customer/Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Customer Details:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {booking.customerName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {booking.customerPhone || "Not provided"}
                        </div>
                      </div>
                    </div>

                    {(booking.billingAddress || booking.shippingAddress) && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Service Address:</h4>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                              {booking.shippingAddress?.address_1 || booking.billingAddress?.address_1}
                              {(booking.shippingAddress?.city || booking.billingAddress?.city) && (
                                <div>{booking.shippingAddress?.city || booking.billingAddress?.city}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review {reviewTarget?.productName || "Service"}</DialogTitle>
            <DialogDescription>Share your experience to help others.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Stars */}
            <div className="text-center">
              <Label className="text-base font-medium text-gray-800 mb-3 block">
                Rate your experience
              </Label>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => setReviewRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        i <= (hoverRating || reviewRating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {reviewRating === 5 && "Excellent"}
                {reviewRating === 4 && "Very Good"}
                {reviewRating === 3 && "Good"}
                {reviewRating === 2 && "Fair"}
                {reviewRating === 1 && "Poor"}
              </p>
            </div>

            {/* Name/Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rev-name">Your Name</Label>
                <Input id="rev-name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="rev-email">Your Email</Label>
                <Input
                  id="rev-email"
                  type="email"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <Label htmlFor="rev-text">Your Review</Label>
              <Textarea
                id="rev-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                required
                placeholder="What did you like? What could be better?"
              />
            </div>

            {reviewMessage && (
              <div className="p-3 rounded border text-sm bg-green-50 border-green-200 text-green-700">{reviewMessage}</div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)} disabled={reviewSubmitting}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={reviewSubmitting || !reviewText || !reviewEmail || !reviewName}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {reviewSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Submit Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
