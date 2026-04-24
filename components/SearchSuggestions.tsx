"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"

interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string
  categories: Array<{ id: number; name: string; slug: string }>
}

interface SearchSuggestionsProps {
  query: string
  onClose: () => void
  isVisible: boolean
}

export default function SearchSuggestions({ query, onClose, isVisible }: SearchSuggestionsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchProducts = async () => {
      if (!query || query.trim().length < 2) {
        setProducts([])
        setTotalResults(0)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.message || "Search failed")
        }

        setProducts(data.products || [])
        setTotalResults(data.total || 0)
      } catch (err) {
        console.error("Search suggestions error:", err)
        setError(err instanceof Error ? err.message : "Search failed")
        setProducts([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible || query.trim().length < 2) {
    return null
  }

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {loading && (
        <div className="p-4 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-pink-500" />
          <p className="text-sm text-gray-600">Searching...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-center">
          <p className="text-sm text-red-600">Error: {error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && query.trim().length >= 2 && (
        <div className="p-4 text-center">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">No services found for "{query}"</p>
          <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="p-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg?height=48&width=48"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{product.categories[0]?.name || "Service"}</p>
                    <span className="text-sm font-semibold text-pink-600 ml-2">RS {product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalResults > products.length && (
            <div className="border-t border-gray-100 p-3">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block w-full text-center py-2 px-4 bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium rounded-lg transition-colors"
              >
                View all {totalResults} results
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
