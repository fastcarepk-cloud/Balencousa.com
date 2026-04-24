"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import type { WooCommerceCategory } from "@/lib/woocommerce-api"

interface WooCommerceCategoryCardProps {
  category: WooCommerceCategory
  onClick: () => void
  isSelected: boolean
}

export function WooCommerceCategoryCard({ category, onClick, isSelected }: WooCommerceCategoryCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 group ${
        isSelected ? "ring-2 ring-pink-500 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        {category.image && !imageError ? (
          <Image
            src={category.image.src || "/placeholder.svg"}
            alt={category.image.alt || category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-pink-400" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Product Count Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-gray-800">{category.count} products</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3
          className={`font-semibold text-lg mb-2 group-hover:text-pink-600 transition-colors ${
            isSelected ? "text-pink-600" : ""
          }`}
        >
          {category.name}
        </h3>

        {category.description && (
          <div
            className="text-sm text-gray-600 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}
      </CardContent>
    </Card>
  )
}
