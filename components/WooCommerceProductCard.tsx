"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, ShoppingCart, Eye, Heart } from "lucide-react"
import type { WooCommerceProduct } from "@/lib/woocommerce-api"

interface WooCommerceProductCardProps {
  product: WooCommerceProduct
}

export function WooCommerceProductCard({ product }: WooCommerceProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return isNaN(numPrice) ? "Free" : `PKR ${numPrice.toLocaleString()}`
  }

  const getStockStatus = () => {
    if (product.stock_status === "instock") {
      return { text: "In Stock", color: "bg-green-100 text-green-800" }
    } else if (product.stock_status === "outofstock") {
      return { text: "Out of Stock", color: "bg-red-100 text-red-800" }
    } else {
      return { text: "On Backorder", color: "bg-yellow-100 text-yellow-800" }
    }
  }

  const stockStatus = getStockStatus()
  const mainImage = product.images?.[0]
  const hasDiscount = product.on_sale && product.regular_price && product.sale_price
  const rating = Number.parseFloat(product.average_rating) || 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        {mainImage && !imageError ? (
          <Image
            src={mainImage.src || "/placeholder.svg"}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && <Badge className="bg-pink-500 text-white">Featured</Badge>}
          {hasDiscount && <Badge className="bg-red-500 text-white">Sale</Badge>}
        </div>

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Categories */}
        {product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.rating_count})</span>
          </div>
        )}

        {/* Short Description */}
        {product.short_description && (
          <div
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-pink-600">{formatPrice(product.sale_price)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.regular_price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Stock Quantity */}
        {product.manage_stock && product.stock_quantity !== null && (
          <p className="text-sm text-gray-600 mb-2">{product.stock_quantity} in stock</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.stock_status === "outofstock"}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock_status === "outofstock" ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
