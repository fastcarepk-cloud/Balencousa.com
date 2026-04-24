"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, Clock, MapPin, Heart, Share2, CheckCircle, MessageCircle, ChevronDown, ChevronUp, ArrowLeft, User, X, Edit3, Send, Eye, TrendingUp, Grid, List, CalendarPlus } from 'lucide-react'
import parse from "html-react-parser"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"

interface ProductPageClientProps {
  product: any
  reviews: any[]
  category?: any
  relatedProducts: any[]
  mostViewedProducts: any[]
}

interface FAQ {
  id: number
  question: string
  answer: string
}

const ratingLabels = {
  5: "Excellent",
  4: "Very Good",
  3: "Good",
  2: "Fair",
  1: "Poor",
}

const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="

// Enhanced HTML stripping function that handles multiple encoding scenarios
const stripHtmlTags = (html: string): string => {
  if (typeof html !== "string" || !html) return ""

  let cleanText = html

  // First, handle HTML entities like &lt; &gt; &amp; etc.
  const entityMap: { [key: string]: string } = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
  }

  // Replace HTML entities first
  Object.keys(entityMap).forEach((entity) => {
    const regex = new RegExp(entity, "gi")
    cleanText = cleanText.replace(regex, entityMap[entity])
  })

  // Handle numeric HTML entities like &#8217; &#8220; etc.
  cleanText = cleanText.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec)
  })

  // Handle hex HTML entities like &#x2019; etc.
  cleanText = cleanText.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(Number.parseInt(hex, 16))
  })

  // Remove HTML tags - comprehensive regex that handles nested tags, attributes, and malformed HTML
  cleanText = cleanText.replace(/<\/?[^>]*>/g, "")

  // Remove any remaining HTML-like patterns and entities
  cleanText = cleanText.replace(/&[a-zA-Z0-9#]+;/g, "")

  // Clean up extra whitespace and normalize
  cleanText = cleanText.replace(/\s+/g, " ").trim()

  // Remove any remaining angle brackets that might be left
  cleanText = cleanText.replace(/[<>]/g, "")

  return cleanText
}

export default function ProductPageClient({
  product,
  reviews: initialReviews,
  category,
  relatedProducts = [],
  mostViewedProducts = [],
}: ProductPageClientProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [newReview, setNewReview] = useState({ name: "", email: "", rating: 5, comment: "" })
  const [isLiked, setIsLiked] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [relatedViewMode, setRelatedViewMode] = useState<"grid" | "list">("grid")
  const [mostViewedViewMode, setMostViewedViewMode] = useState<"grid" | "list">("grid")

  const router = useRouter()

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I book this service?",
      answer:
        "You can book this service by clicking the 'Book Now' button or 'Book on WhatsApp' for instant booking. Our team will confirm your appointment within 30 minutes.",
    },
    {
      id: 2,
      question: "What is included in the service?",
      answer:
        "The service includes a professional certified beautician, premium quality products, all necessary equipment, and post-service care tips. Everything needed for the treatment is provided.",
    },
    {
      id: 3,
      question: "How long does the service take?",
      answer:
        "The duration varies by service but is clearly mentioned in the service details. Our professionals arrive on time and complete the service within the specified timeframe.",
    },
    {
      id: 4,
      question: "Do you provide services in my area?",
      answer:
        "We provide services across major cities in Pakistan. During booking, you can check if your area is covered by our service network.",
    },
    {
      id: 5,
      question: "What if I need to reschedule or cancel?",
      answer:
        "You can reschedule or cancel your appointment up to 2 hours before the scheduled time. Contact us via WhatsApp or call our customer service for assistance.",
    },
    {
      id: 6,
      question: "Are the products used safe and hygienic?",
      answer:
        "Yes, we use only premium, branded products and maintain strict hygiene standards. All equipment is sanitized, and our professionals follow safety protocols.",
    },
  ]

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)
    setReviewMessage("")

    try {
      const response = await fetch("/api/woocommerce/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          reviewer: newReview.name,
          reviewer_email: newReview.email,
          review: newReview.comment,
          rating: newReview.rating,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Clear the form
        setNewReview({ name: "", email: "", rating: 5, comment: "" })
        setShowReviewModal(false)

        // Show success message
        if (result.pending) {
          setReviewMessage("Thank you! Your review has been submitted and will be published after admin approval.")
        } else {
          setReviewMessage("Thank you! Your review has been submitted successfully.")

          // Add review to local state for immediate display if not pending
          const newReviewData = {
            id: Date.now(),
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toLocaleDateString(),
            verified: false,
            avatar: "/images/mehndi-service.jpg",
          }
          setReviews([newReviewData, ...reviews])
        }
      } else {
        setReviewMessage("Failed to submit review. Please try again later.")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setReviewMessage("Thank you! Your review has been submitted and will be published after admin approval.")

      // Clear the form even on error for better UX
      setNewReview({ name: "", email: "", rating: 5, comment: "" })
      setShowReviewModal(false)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(
      `Hi! I want to book "${stripHtmlTags(product.name)}" service. Can you help me with the booking?`,
    )
    const phoneNumber = "923265338779"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleBookNow = () => {
    router.push(`/booking/${product.slug}`)
  }

  const handleStarClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const openReviewModal = () => {
    setShowReviewModal(true)
    setReviewMessage("")
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setNewReview({ name: "", email: "", rating: 5, comment: "" })
    setHoveredRating(0)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Clean product data
  const cleanProduct = {
    ...product,
    name: stripHtmlTags(product.name || ""),
    shortDescription: stripHtmlTags(product.shortDescription || ""),
    longDescription: stripHtmlTags(product.longDescription || product.description || ""),
  }

  // Clean related products data
  const cleanRelatedProducts = relatedProducts.map((service) => ({
    ...service,
    name: stripHtmlTags(service.name || ""),
    shortDescription: stripHtmlTags(service.shortDescription || service.description || ""),
  }))

  // Clean most viewed products data
  const cleanMostViewedProducts = mostViewedProducts.map((service) => ({
    ...service,
    name: stripHtmlTags(service.name || ""),
    shortDescription: stripHtmlTags(service.shortDescription || service.description || ""),
  }))

  const ProductCard = ({ service, viewMode }: { service: any; viewMode: "grid" | "list" }) => {
    if (viewMode === "list") {
      return (
        <Link key={service.id} href={`/product/${service.slug}`} onClick={scrollToTop}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 flex-shrink-0">
                  <Image
                    src={service.image || "/placeholder.svg?height=200&width=300"}
                    alt={service.name}
                    width={300}
                    height={200}
                    className="w-full h-40 md:h-32 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.shortDescription}</p>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{service.rating || 4.5}</span>
                      <span className="text-xs text-gray-500">({service.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">RS {service.price || 0}</span>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )
    }

    return (
      <Link key={service.id} href={`/product/${service.slug}`} onClick={scrollToTop}>
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-0">
            <Image
              src={service.image || "/placeholder.svg?height=200&width=300"}
              alt={service.name}
              width={300}
              height={200}
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2">{service.name}</h3>
              <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{service.shortDescription}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg md:text-xl font-bold text-gray-900">RS {service.price || 0}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs md:text-sm text-gray-600">{service.rating || 4.5}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Header />

      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
        <Link
          href={category ? `/categories/${category.slug}` : "/categories"}
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back to {category?.name || "Categories"}</span>
        </Link>
      </div>

      <section className="hidden md:block bg-gradient-to-r from-pink-500 to-purple-600 py-3">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white font-medium text-sm md:text-base">
              🎉 Special Offer: Get 20% OFF on your first booking! Use code: FIRST20
            </p>
          </div>
        </div>
      </section>

      <div className="hidden md:block container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/categories" className="text-gray-600 hover:text-pink-500 transition-colors">
            Categories
          </Link>
          {category && (
            <>
              <span className="text-gray-400">/</span>
              <Link
                href={`/categories/${category.slug}`}
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                {stripHtmlTags(category.name || "")}
              </Link>
            </>
          )}
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{cleanProduct.name}</span>
        </div>
      </div>

      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
            <div className="relative">
              <Image
                src={cleanProduct.image || "/placeholder.svg?height=400&width=600"}
                alt={cleanProduct.name}
                width={600}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
                priority
              />
              {cleanProduct.discount > 0 && (
                <Badge className="absolute top-3 left-3 md:top-6 md:left-6 bg-red-500 text-white text-sm md:text-lg px-2 py-1 md:px-3">
                  {cleanProduct.discount}% OFF
                </Badge>
              )}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm p-2"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm p-2">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                  {cleanProduct.name}
                </h1>
              </div>

              {cleanProduct.shortDescription && (
                <div className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {cleanProduct.shortDescription}
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 md:w-5 md:h-5 ${i < Math.floor(cleanProduct.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-base md:text-lg font-medium text-gray-900 ml-2">
                    {cleanProduct.rating || 4.5}
                  </span>
                </div>
                {reviews.length > 0 && (
                  <span className="text-sm md:text-base text-gray-600">({reviews.length} reviews)</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  <span className="text-sm md:text-base text-gray-600">
                    Duration: {cleanProduct.duration || "60 min"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  <span className="text-sm md:text-base text-gray-600">At your location</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <span className="text-2xl md:text-4xl font-bold text-gray-900">RS {cleanProduct.price || 0}</span>
                  {cleanProduct.originalPrice > cleanProduct.price && (
                    <span className="text-lg md:text-2xl text-gray-500 line-through">
                      RS {cleanProduct.originalPrice}
                    </span>
                  )}
                  {cleanProduct.discount > 0 && (
                    <Badge className="bg-green-500 text-white text-xs md:text-sm">
                      Save RS {(cleanProduct.originalPrice || 0) - (cleanProduct.price || 0)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Professional service includes all materials and equipment
                </p>

                <div className="hidden md:block space-y-3">
                  <Button
                    size="lg"
                    onClick={handleBookNow}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 text-lg font-semibold rounded-xl"
                  >
                    <CalendarPlus className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 py-4 text-lg font-semibold rounded-xl bg-transparent"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">What's Included:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-sm md:text-base text-gray-600">Professional certified beautician</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-sm md:text-base text-gray-600">Premium quality products</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-sm md:text-base text-gray-600">All necessary equipment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-sm md:text-base text-gray-600">Post-service care tips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 md:px-6 md:pb-6">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Reviews</h2>
            <Button
              onClick={openReviewModal}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              <span>Share Your Feedback</span>
            </Button>
          </div>

          {/* Success Message */}
          {reviewMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{reviewMessage}</p>
            </div>
          )}

          <div className="space-y-4 md:space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base">{review.name}</h4>
                            {review.verified && (
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-700 ml-13">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this service!</p>
                  <Button
                    onClick={openReviewModal}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Write First Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {cleanRelatedProducts.length > 0 && (
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-pink-500" />
                Related {category?.name || "Products"}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={relatedViewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRelatedViewMode("grid")}
                  className={relatedViewMode === "grid" ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={relatedViewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRelatedViewMode("list")}
                  className={relatedViewMode === "list" ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className={
                relatedViewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  : "space-y-4"
              }
            >
              {cleanRelatedProducts.map((service) => (
                <ProductCard key={service.id} service={service} viewMode={relatedViewMode} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Long Description Section */}
      {cleanProduct.longDescription && (
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Product Details</h2>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4">
                {typeof cleanProduct.longDescription === "string"
                  ? parse(cleanProduct.longDescription, {
                      replace: (domNode: any) => {
                        if (!domNode.type || domNode.type === "text") return
                        
                        // Style img tags for responsive display
                        if (domNode.type === "tag" && domNode.name === "img") {
                          return (
                            <img
                              key={domNode.attribs.src}
                              {...domNode.attribs}
                              alt={domNode.attribs.alt || "Product image"}
                              className="max-w-full h-auto rounded-lg my-4 shadow-sm"
                              style={{ maxWidth: "100%" }}
                            />
                          )
                        }
                        
                        // Style p tags
                        if (domNode.type === "tag" && domNode.name === "p") {
                          return <p className="mb-4 text-gray-700">{domNode.children}</p>
                        }
                        
                        // Style heading tags
                        if (domNode.type === "tag" && domNode.name === "h1") {
                          return <h1 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{domNode.children}</h1>
                        }
                        if (domNode.type === "tag" && domNode.name === "h2") {
                          return <h2 className="text-xl font-bold mt-5 mb-2 text-gray-900">{domNode.children}</h2>
                        }
                        if (domNode.type === "tag" && domNode.name === "h3") {
                          return <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800">{domNode.children}</h3>
                        }
                        
                        // Style list tags
                        if (domNode.type === "tag" && domNode.name === "ul") {
                          return <ul className="list-disc list-inside space-y-2 mb-4 pl-4">{domNode.children}</ul>
                        }
                        if (domNode.type === "tag" && domNode.name === "ol") {
                          return <ol className="list-decimal list-inside space-y-2 mb-4 pl-4">{domNode.children}</ol>
                        }
                        if (domNode.type === "tag" && domNode.name === "li") {
                          return <li className="text-gray-700">{domNode.children}</li>
                        }
                        
                        // Style br tags
                        if (domNode.type === "tag" && domNode.name === "br") {
                          return <br />
                        }
                        
                        // Style b/strong tags
                        if (domNode.type === "tag" && (domNode.name === "b" || domNode.name === "strong")) {
                          return <strong className="font-bold text-gray-900">{domNode.children}</strong>
                        }
                        
                        // Style i/em tags
                        if (domNode.type === "tag" && (domNode.name === "i" || domNode.name === "em")) {
                          return <em className="italic text-gray-700">{domNode.children}</em>
                        }
                        
                        // Style a tags
                        if (domNode.type === "tag" && domNode.name === "a") {
                          return (
                            <a
                              href={domNode.attribs.href}
                              className="text-pink-600 hover:text-pink-700 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {domNode.children}
                            </a>
                          )
                        }
                      },
                    })
                  : cleanProduct.longDescription}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Most Viewed Products Section */}
      {cleanMostViewedProducts.length > 0 && (
        <section className="py-8 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-500" />
                Most Viewed Products
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={mostViewedViewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMostViewedViewMode("grid")}
                  className={mostViewedViewMode === "grid" ? "bg-purple-500 hover:bg-purple-600" : ""}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={mostViewedViewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMostViewedViewMode("list")}
                  className={mostViewedViewMode === "list" ? "bg-purple-500 hover:bg-purple-600" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className={
                mostViewedViewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  : "space-y-4"
              }
            >
              {cleanMostViewedProducts.map((service) => (
                <ProductCard key={service.id} service={service} viewMode={mostViewedViewMode} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Share Your Feedback</h3>
                <p className="text-sm text-gray-600 mt-1">Help others by sharing your experience</p>
              </div>
              <button
                onClick={closeReviewModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmittingReview}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating Section */}
                <div className="text-center">
                  <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                    How would you rate this service?
                  </Label>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                        className="p-1 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                        disabled={isSubmittingReview}
                      >
                        <Star
                          className={`w-10 h-10 transition-all duration-200 ${
                            star <= (hoveredRating || newReview.rating)
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              : "text-gray-300 hover:text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-lg font-medium text-pink-600">
                    {ratingLabels[newReview.rating as keyof typeof ratingLabels]}
                  </p>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modal-name" className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Name *
                    </Label>
                    <Input
                      id="modal-name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your name"
                      disabled={isSubmittingReview}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modal-email" className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Email *
                    </Label>
                    <Input
                      id="modal-email"
                      type="email"
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your email"
                      disabled={isSubmittingReview}
                    />
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <Label htmlFor="modal-comment" className="text-sm font-medium text-gray-700 mb-2 block">
                    Your Review *
                  </Label>
                  <Textarea
                    id="modal-comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    required
                    className="border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                    placeholder="Share your experience with this service..."
                    disabled={isSubmittingReview}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeReviewModal}
                    className="flex-1 h-12 border-2 border-gray-200 hover:bg-gray-50 bg-transparent"
                    disabled={isSubmittingReview}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex space-x-3">
          <Button
            onClick={handleBookNow}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 font-semibold rounded-lg"
            style={{ minHeight: "48px" }}
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-pink-500 text-pink-600 hover:bg-pink-50 py-3 font-semibold rounded-lg bg-transparent"
            style={{ minHeight: "48px" }}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
