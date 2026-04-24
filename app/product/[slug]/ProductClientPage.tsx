"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"

interface ProductClientPageProps {
  product: any
  category: any
  relatedServices: any[]
}

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface FAQ {
  id: number
  question: string
  answer: string
}

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

export default function ProductClientPage({ product, category, relatedServices = [] }: ProductClientPageProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" })
  const [isLiked, setIsLiked] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

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

  useEffect(() => {
    // Mock reviews data
    setReviews([
      {
        id: 1,
        name: "Fatima Al-Zahra",
        rating: 5,
        comment: "Absolutely amazing service! The professional was very skilled and friendly. Highly recommend!",
        date: "2024-01-15",
        verified: true,
      },
      {
        id: 2,
        name: "Aisha Mohammed",
        rating: 4,
        comment: "Great experience overall. The service was professional and the results were excellent.",
        date: "2024-01-10",
        verified: true,
      },
      {
        id: 3,
        name: "Mariam Hassan",
        rating: 5,
        comment: "Perfect! Exactly what I was looking for. Will definitely book again.",
        date: "2024-01-08",
        verified: false,
      },
    ])
  }, [])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    const review: Review = {
      id: reviews.length + 1,
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    }
    setReviews([review, ...reviews])
    setNewReview({ name: "", rating: 5, comment: "" })
  }

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(
      `Hi! I want to book "${product.name}" service. Can you help me with the booking?`,
    )
    const phoneNumber = "923265338779"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleBookNow = () => {
    router.push(`/booking/${product.slug}`)
  }

  // Clean product data
  const cleanProduct = {
    ...product,
    name: stripHtmlTags(product.name || ""),
    shortDescription: stripHtmlTags(product.shortDescription || ""),
    longDescription: stripHtmlTags(product.longDescription || product.description || ""),
  }

  // Clean related services data
  const cleanRelatedServices = relatedServices.map((service) => ({
    ...service,
    name: stripHtmlTags(service.name || ""),
    shortDescription: stripHtmlTags(service.shortDescription || service.description || ""),
  }))

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
                <div className="text-base md:text-xl text-gray-600 leading-relaxed">{cleanProduct.longDescription}</div>
              </div>

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
                {cleanProduct.reviewCount > 0 && (
                  <span className="text-sm md:text-base text-gray-600">({cleanProduct.reviewCount} reviews)</span>
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
                    Book {cleanProduct.name} Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWhatsAppBooking}
                    className="w-full border-green-500 text-green-600 hover:bg-green-50 py-4 text-lg font-semibold rounded-xl bg-transparent"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book on WhatsApp
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Customer Reviews</h2>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{review.name}</h4>
                          {review.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                              Verified
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
                    <p className="text-sm md:text-base text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        required
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating" className="text-sm">
                        Rating
                      </Label>
                      <select
                        id="rating"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number.parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="comment" className="text-sm">
                        Your Review
                      </Label>
                      <Textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={3}
                        required
                        className="text-sm"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm">
                      Submit Review
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      {cleanRelatedServices.length > 0 && (
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              More {category?.name || "Services"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cleanRelatedServices.map((service) => (
                <Link key={service.id} href={`/product/${service.slug}`} onClick={scrollToTop}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <Image
                        src={service.image || "/placeholder.svg?height=200&width=300"}
                        alt={service.name}
                        width={300}
                        height={200}
                        className="w-full h-40 md:h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-3 md:p-4">
                        <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2 line-clamp-2">
                          {service.name}
                        </h3>
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
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex space-x-3">
          <Button
            onClick={handleBookNow}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 font-semibold rounded-lg"
            style={{ minHeight: "48px" }}
          >
            Book Now
          </Button>
          <Button
            variant="outline"
            onClick={handleWhatsAppBooking}
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50 py-3 font-semibold rounded-lg bg-transparent"
            style={{ minHeight: "48px" }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
