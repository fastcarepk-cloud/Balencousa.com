import { type NextRequest, NextResponse } from "next/server"
import { fetchWooCommerceProducts, transformWooCommerceProduct } from "@/lib/woocommerce-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ products: [], total: 0 })
    }

    console.log(`Search API: Searching for "${query}" with limit ${limit}`)

    // Fetch all products from WooCommerce
    const allProducts = await fetchWooCommerceProducts()

    if (!Array.isArray(allProducts)) {
      console.error("Search API: Invalid products data received")
      return NextResponse.json({ products: [], total: 0 })
    }

    // Transform products to consistent format
    const transformedProducts = allProducts.map(transformWooCommerceProduct)

    // Filter products based on search query
    const searchTerm = query.toLowerCase().trim()
    const filteredProducts = transformedProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm)
      const descriptionMatch = product.shortDescription?.toLowerCase().includes(searchTerm) || false
      const longDescriptionMatch = product.longDescription?.toLowerCase().includes(searchTerm) || false
      const categoryMatch = product.categories?.some((cat) => cat.name.toLowerCase().includes(searchTerm)) || false

      return nameMatch || descriptionMatch || longDescriptionMatch || categoryMatch
    })

    // Sort by relevance (name matches first, then description matches)
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchTerm)
      const bNameMatch = b.name.toLowerCase().includes(searchTerm)

      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1

      // If both or neither match name, sort by name alphabetically
      return a.name.localeCompare(b.name)
    })

    // Apply limit
    const limitedProducts = sortedProducts.slice(0, limit)

    console.log(`Search API: Found ${filteredProducts.length} products, returning ${limitedProducts.length}`)

    return NextResponse.json({
      products: limitedProducts,
      total: filteredProducts.length,
      query: query,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        products: [],
        total: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
