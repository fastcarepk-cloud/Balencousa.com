"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Star, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

interface Service {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  image: string
  price: number
  regular_price: number
  rating: number
  review_count: number
  duration?: number
  discount?: number
  featured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  count: number
}

interface CategoryClientPageProps {
  category: Category
  services: Service[]
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

// Enhanced truncate function with better word boundary handling
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ""
  const cleanText = stripHtmlTags(text)
  if (cleanText.length <= maxLength) return cleanText

  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace).trim() + "..."
  }

  return truncated.trim() + "..."
}

// Function to format review count
const formatReviewCount = (count: number): string => {
  if (!count || count === 0) return ""
  return `(${count} review${count !== 1 ? "s" : ""})`
}

export default function CategoryClientPage({ category, services = [] }: CategoryClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [priceFilter, setPriceFilter] = useState("all")

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtmlTags(service.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        stripHtmlTags(service.short_description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesPrice = (() => {
        const price = Number(service.price) || 0
        switch (priceFilter) {
          case "under-1000":
            return price < 1000
          case "1000-3000":
            return price >= 1000 && price <= 3000
          case "3000-5000":
            return price >= 3000 && price <= 5000
          case "over-5000":
            return price > 5000
          default:
            return true
        }
      })()

      return matchesSearch && matchesPrice
    })

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "price-low":
          return (Number(a.price) || 0) - (Number(b.price) || 0)
        case "price-high":
          return (Number(b.price) || 0) - (Number(a.price) || 0)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "duration":
          return (a.duration || 0) - (b.duration || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [services, searchTerm, sortBy, priceFilter])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Category Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20 mt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{category?.name || "Category"}</h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
                {stripHtmlTags(category?.description || "Discover our professional beauty services")}
              </p>
              <div className="flex items-center justify-center space-x-4 text-lg">
                <span>{services.length} services available</span>
                <span>•</span>
                <span>Professional quality</span>
                <span>•</span>
                <span>Home service</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="under-1000">Under RS 1,000</option>
                <option value="1000-3000">RS 1,000 - 3,000</option>
                <option value="3000-5000">RS 3,000 - 5,000</option>
                <option value="over-5000">Over RS 5,000</option>
              </select>
              <div className="text-sm text-gray-600">{filteredAndSortedServices.length} services found</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedServices.map((service, index) => (
                <FadeInSection key={service.id || index} delay={index * 0.1}>
                  <Link href={`/product/${service.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={
                              service.image ||
                              `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(service.name || "Service")}`
                            }
                            alt={service.name || "Service"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {service.discount && service.discount > 0 && (
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                              {service.discount}% OFF
                            </Badge>
                          )}
                          {service.featured && (
                            <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">Featured</Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                            {stripHtmlTags(service.name || "Untitled Service")}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {truncateText(service.short_description || service.description || "", 100)}
                          </p>

                          {/* Rating and Reviews */}
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{service.rating || 4.5}</span>
                            </div>
                            {service.review_count > 0 && (
                              <span className="text-sm text-gray-500">{formatReviewCount(service.review_count)}</span>
                            )}
                            {service.duration && (
                              <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">{service.duration} min</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-pink-600">
                                RS {service.price ? Number(service.price).toLocaleString() : "N/A"}
                              </span>
                              {service.regular_price && Number(service.regular_price) > Number(service.price) && (
                                <span className="text-sm text-gray-500 line-through">
                                  RS {Number(service.regular_price).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <ArrowRight className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No services match your search for "${searchTerm}"`
                  : "No services are available in this category at the moment"}
              </p>
              {(searchTerm || priceFilter !== "all") && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm("")} className="bg-pink-500 hover:bg-pink-600 text-white">
                      Clear Search
                    </Button>
                  )}
                  {priceFilter !== "all" && (
                    <Button
                      onClick={() => setPriceFilter("all")}
                      variant="outline"
                      className="border-pink-500 text-pink-600 hover:bg-pink-50"
                    >
                      Clear Price Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help Choosing?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Our beauty experts are here to help you select the perfect service for your needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full"
                  asChild
                >
                  <a href="https://wa.me/923265338779" target="_blank" rel="noopener noreferrer">
                    WhatsApp Consultation
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-pink-600 font-semibold px-8 py-4 text-lg rounded-full bg-transparent"
                  asChild
                >
                  <a href="tel:+923265338779">Call Expert</a>
                </Button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
