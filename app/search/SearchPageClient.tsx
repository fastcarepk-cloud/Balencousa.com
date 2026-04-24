"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Grid, List, Filter, SlidersHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice: number
  discount: number
  image: string
  shortDescription: string
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  rating: number
  reviewCount: number
  featured: boolean
  inStock: boolean
}

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setProducts([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=50`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      let results = data.products || []
      setTotalResults(data.total || results.length)

      // Apply sorting
      if (sortBy === "name") {
        results.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
      } else if (sortBy === "price_low") {
        results.sort((a: Product, b: Product) => a.price - b.price)
      } else if (sortBy === "price_high") {
        results.sort((a: Product, b: Product) => b.price - a.price)
      } else if (sortBy === "rating") {
        results.sort((a: Product, b: Product) => b.rating - a.rating)
      }

      // Apply price filtering
      if (priceRange !== "all") {
        results = results.filter((product: Product) => {
          const price = product.price
          switch (priceRange) {
            case "under_1000":
              return price < 1000
            case "1000_5000":
              return price >= 1000 && price <= 5000
            case "5000_10000":
              return price >= 5000 && price <= 10000
            case "over_10000":
              return price > 10000
            default:
              return true
          }
        })
      }

      setProducts(results)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search products. Please try again.")
      setProducts([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      // Update URL without page reload
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Re-run search when filters change
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }, [sortBy, priceRange])

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{product.discount}%</Badge>
          )}
          {product.featured && <Badge className="absolute top-2 right-2 bg-pink-500 text-white">Featured</Badge>}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{product.categories[0]?.name || "Service"}</span>
            <div className="text-lg font-bold text-pink-600">
              {product.discount > 0 ? (
                <>
                  <span className="line-through text-gray-400 text-sm mr-1">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  Rs. {product.price.toLocaleString()}
                </>
              ) : (
                `Rs. ${product.price.toLocaleString()}`
              )}
            </div>
          </div>
          {product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.shortDescription}</p>
          )}
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )

  const ProductListItem = ({ product }: { product: Product }) => (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            {product.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">-{product.discount}%</Badge>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                {product.name}
              </h3>
              <div className="text-lg font-bold text-pink-600 ml-4">
                {product.discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400 text-sm mr-1">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    Rs. {product.price.toLocaleString()}
                  </>
                ) : (
                  `Rs. ${product.price.toLocaleString()}`
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500 mb-2 block">{product.categories[0]?.name || "Service"}</span>
            {product.shortDescription && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">{product.shortDescription}</p>
            )}
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Services</h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for services, treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {/* Results Info */}
          {!isLoading && searchQuery && (
            <p className="text-gray-600">
              {products.length > 0
                ? `Showing ${products.length} of ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Filters and Controls */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under_1000">Under Rs. 1,000</SelectItem>
                  <SelectItem value="1000_5000">Rs. 1,000 - 5,000</SelectItem>
                  <SelectItem value="5000_10000">Rs. 5,000 - 10,000</SelectItem>
                  <SelectItem value="over_10000">Over Rs. 10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-600 mb-4" />
            <p className="text-gray-600">Searching for services...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => performSearch(searchQuery)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && searchQuery && products.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services matching "{searchQuery}". Try adjusting your search terms.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-pink-50"
                onClick={() => {
                  setSearchQuery("facial")
                  performSearch("facial")
                }}
              >
                facial
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-pink-50"
                onClick={() => {
                  setSearchQuery("massage")
                  performSearch("massage")
                }}
              >
                massage
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-pink-50"
                onClick={() => {
                  setSearchQuery("hair styling")
                  performSearch("hair styling")
                }}
              >
                hair styling
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-pink-50"
                onClick={() => {
                  setSearchQuery("makeup")
                  performSearch("makeup")
                }}
              >
                makeup
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spelling</li>
                <li>Try more general terms</li>
                <li>Use different keywords</li>
              </ul>
            </div>
          </div>
        )}

        {/* Results Grid/List */}
        {!isLoading && !error && products.length > 0 && (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {products.map((product) =>
              viewMode === "grid" ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              ),
            )}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {!isLoading && !error && products.length > 0 && products.length < totalResults && (
          <div className="text-center mt-8">
            <Button
              onClick={() => performSearch(searchQuery)}
              variant="outline"
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              Load More Results
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
