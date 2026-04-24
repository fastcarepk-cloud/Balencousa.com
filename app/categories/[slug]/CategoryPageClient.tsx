"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Search, Filter, ArrowLeft, Grid, List } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

interface CategoryPageClientProps {
  category: any
  products: any[]
}

const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="

// Category-specific background images mapping
const getCategoryBackgroundImage = (categorySlug: string) => {
  const backgroundImages: { [key: string]: string } = {
    makeup: "/placeholder.svg?height=400&width=1200&text=Professional+Makeup+Services",
    "hair-treatment": "/placeholder.svg?height=400&width=1200&text=Hair+Treatment+Services",
    "waxing-services": "/placeholder.svg?height=400&width=1200&text=Waxing+Services",
    "massage-services": "/placeholder.svg?height=400&width=1200&text=Massage+Services",
    "mani-pedi": "/placeholder.svg?height=400&width=1200&text=Manicure+Pedicure+Services",
    "facial-services": "/placeholder.svg?height=400&width=1200&text=Facial+Services",
    "mehndi-services": "/images/mehndi-service.jpg",
    "hair-styling-cut": "/placeholder.svg?height=400&width=1200&text=Hair+Styling+and+Cut",
  }

  return backgroundImages[categorySlug] || "/images/beauty-banner.jpg"
}

// Category-specific gradient colors
const getCategoryGradient = (categorySlug: string) => {
  const gradients: { [key: string]: string } = {
    makeup: "from-pink-500/85 to-rose-600/85",
    "hair-treatment": "from-purple-500/85 to-indigo-600/85",
    "waxing-services": "from-emerald-500/85 to-teal-600/85",
    "massage-services": "from-blue-500/85 to-cyan-600/85",
    "mani-pedi": "from-violet-500/85 to-purple-600/85",
    "facial-services": "from-amber-500/85 to-orange-600/85",
    "mehndi-services": "from-pink-500/85 to-purple-600/85",
    "hair-styling-cut": "from-slate-500/85 to-gray-600/85",
  }

  return gradients[categorySlug] || "from-pink-500/85 to-purple-600/85"
}

export default function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const backgroundImage = getCategoryBackgroundImage(category.slug)
  const gradientOverlay = getCategoryGradient(category.slug)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Mobile Back Button */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
        <Link href="/categories" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back to Categories</span>
        </Link>
      </div>

      {/* Hero Section with Category-Specific Background Image */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-8 md:py-14">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage || "/placeholder.svg"}
            alt={`${category.name} Background`}
            fill
            className="object-cover"
            priority
          />
          {/* Category-Specific Color Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${gradientOverlay}`}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="text-center text-white">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">{category.name}</h1>
              <p className="text-sm md:text-lg text-white/90 mb-4 max-w-3xl mx-auto">
                {category.description || `Professional ${category.name.toLowerCase()} services at your doorstep`}
              </p>
              <div className="text-white/90 text-sm md:text-base">
                <span className="text-lg md:text-xl font-bold">{products.length}</span> services available
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="hidden md:block container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/categories" className="text-gray-600 hover:text-pink-500 transition-colors">
            Categories
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
      </div>

      {/* Search, Filter and View Toggle */}
      <section className="py-3 md:py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 md:pl-10 py-2 md:py-3 text-sm md:text-base"
              />
            </div>
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ${viewMode === "grid" ? "bg-pink-500 text-white" : "text-gray-600"}`}
                >
                  <Grid className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ${viewMode === "list" ? "bg-pink-500 text-white" : "text-gray-600"}`}
                >
                  <List className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs md:text-sm text-gray-600 text-center md:text-right">
            {filteredProducts.length} services found
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              {/* Grid View - 2 columns on mobile, responsive on larger screens */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <FadeInSection key={product.id} delay={index * 100}>
                      <Link href={`/product/${product.slug}`}>
                        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2">
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={400}
                                height={250}
                                className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                              />
                              {product.discount > 0 && (
                                <Badge className="absolute top-1 left-1 md:top-3 md:left-3 bg-red-500 text-white text-xs md:text-sm px-1 md:px-2 py-0.5 md:py-1">
                                  {product.discount}% OFF
                                </Badge>
                              )}
                              {product.featured && (
                                <Badge className="absolute top-1 right-1 md:top-3 md:right-3 bg-pink-500 text-white text-xs md:text-sm px-1 md:px-2 py-0.5 md:py-1">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="p-2 md:p-4 lg:p-6">
                              <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 line-clamp-2 hidden sm:block">
                                {product.shortDescription}
                              </p>
                              <div className="flex items-center space-x-1 md:space-x-2 mb-2 md:mb-3">
                                <div className="flex items-center space-x-0.5 md:space-x-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs md:text-sm font-medium text-gray-900">{product.rating}</span>
                                </div>
                                <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
                                  ({product.reviewCount})
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                  <span className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
                                    RS {product.price}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-xs md:text-sm text-gray-500 line-through">
                                      RS {product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                <span className="text-pink-500 group-hover:translate-x-1 transition-transform text-sm md:text-base hidden sm:inline">
                                  →
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </FadeInSection>
                  ))}
                </div>
              )}

              {/* List View - Optimized for mobile */}
              {viewMode === "list" && (
                <div className="space-y-3 md:space-y-4">
                  {filteredProducts.map((product, index) => (
                    <FadeInSection key={product.id} delay={index * 50}>
                      <Link href={`/product/${product.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-0">
                            <div className="flex">
                              {/* Image - Smaller on mobile */}
                              <div className="relative w-20 sm:w-32 md:w-48 h-20 sm:h-32 md:h-40 flex-shrink-0">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                                  placeholder="blur"
                                  blurDataURL={BLUR_DATA_URL}
                                />
                                {product.discount > 0 && (
                                  <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-500 text-white text-xs px-1 py-0.5">
                                    {product.discount}% OFF
                                  </Badge>
                                )}
                              </div>

                              {/* Content - Optimized spacing for mobile */}
                              <div className="flex-1 p-3 md:p-4 lg:p-6">
                                <div className="flex flex-col h-full justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                                      {product.name}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 hidden sm:block">
                                      {product.shortDescription}
                                    </p>
                                    <div className="flex items-center space-x-1 md:space-x-2 mb-2">
                                      <div className="flex items-center space-x-0.5 md:space-x-1">
                                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs md:text-sm font-medium text-gray-900">
                                          {product.rating}
                                        </span>
                                      </div>
                                      <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
                                        ({product.reviewCount})
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price and Action - Mobile optimized */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                      <span className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
                                        RS {product.price}
                                      </span>
                                      {product.originalPrice > product.price && (
                                        <span className="text-xs md:text-sm text-gray-500 line-through">
                                          RS {product.originalPrice}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {product.featured && (
                                        <Badge className="bg-pink-500 text-white text-xs px-1 py-0.5 hidden sm:inline-block">
                                          Featured
                                        </Badge>
                                      )}
                                      <Button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm">
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </FadeInSection>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-base md:text-lg text-gray-600">No services found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
