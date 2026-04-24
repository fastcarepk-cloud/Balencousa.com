"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Search, Filter, Grid, List, Star, ArrowRight, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

interface CategoryPageClientProps {
  category: any
  products: any[]
}

export default function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState("all")

  // Filter and sort products
  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Filter by price range
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number)
    filteredProducts = filteredProducts.filter((product) => {
      const price = product.price
      if (max) {
        return price >= min && price <= max
      } else {
        return price >= min
      }
    })
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default: // popularity
        return b.reviewCount - a.reviewCount
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{category.name}</h1>
              <p className="text-base md:text-xl text-pink-100 max-w-2xl mx-auto">
                {category.description || `Professional ${category.name.toLowerCase()} services at your doorstep`}
              </p>
              <div className="mt-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {products.length} Services Available
                </Badge>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:pl-10 pr-4 py-2 w-full text-sm md:text-base"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-1000">Under Rs 1,000</SelectItem>
                  <SelectItem value="1000-3000">Rs 1,000 - 3,000</SelectItem>
                  <SelectItem value="3000-5000">Rs 3,000 - 5,000</SelectItem>
                  <SelectItem value="5000">Above Rs 5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              <div className="mb-6 md:mb-8">
                <p className="text-sm md:text-base text-gray-600">
                  Showing {filteredProducts.length} of {products.length} services
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
                    : "space-y-4 md:space-y-6"
                }
              >
                {filteredProducts.map((product, index) => (
                  <FadeInSection key={product.id} delay={index * 50}>
                    {viewMode === "grid" ? (
                      <Link href={`/product/${product.slug}`}>
                        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2">
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg?height=200&width=300"}
                                alt={product.name}
                                width={300}
                                height={200}
                                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.discount > 0 && (
                                <Badge className="absolute top-1 left-1 md:top-3 md:left-3 bg-red-500 text-white text-xs md:text-sm">
                                  {product.discount}% OFF
                                </Badge>
                              )}
                              {product.featured && (
                                <Badge className="absolute top-1 right-1 md:top-3 md:right-3 bg-pink-500 text-white text-xs md:text-sm">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="p-2 md:p-4">
                              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                                {product.name}
                              </h3>
                              <div className="flex items-center space-x-1 md:space-x-2 mb-2 md:mb-3">
                                <div className="flex items-center space-x-0.5 md:space-x-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs md:text-sm font-medium text-gray-900">{product.rating}</span>
                                </div>
                                <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
                                  ({product.reviewCount})
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                  <span className="text-sm md:text-lg font-bold text-gray-900">Rs {product.price}</span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-xs md:text-sm text-gray-500 line-through">
                                      Rs {product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ) : (
                      <Link href={`/product/${product.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center space-x-4 md:space-x-6">
                              <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                                <Image
                                  src={product.image || "/placeholder.svg?height=100&width=150"}
                                  alt={product.name}
                                  width={150}
                                  height={100}
                                  className="w-20 h-16 sm:w-24 sm:h-16 md:w-32 md:h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {product.discount > 0 && (
                                  <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
                                    {product.discount}% OFF
                                  </Badge>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-pink-600 transition-colors">
                                      {product.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-3">
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs md:text-sm font-medium text-gray-900">
                                          {product.rating}
                                        </span>
                                        <span className="text-xs md:text-sm text-gray-600">
                                          ({product.reviewCount})
                                        </span>
                                      </div>
                                      {product.featured && (
                                        <Badge variant="outline" className="text-xs">
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg md:text-xl font-bold text-gray-900">
                                        Rs {product.price}
                                      </span>
                                      {product.originalPrice > product.price && (
                                        <span className="text-sm text-gray-500 line-through">
                                          Rs {product.originalPrice}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-pink-500 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                  </FadeInSection>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                {searchTerm
                  ? `No services match "${searchTerm}". Try a different search term.`
                  : "No services available in this category at the moment."}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")} className="bg-pink-500 hover:bg-pink-600 text-white">
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
