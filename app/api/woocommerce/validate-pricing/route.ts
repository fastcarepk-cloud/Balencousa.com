import { type NextRequest, NextResponse } from "next/server"
import { fetchProductById } from "@/lib/woocommerce-api"

interface ValidationRequest {
  product_id: number
  base_price: number
  addons: Array<{
    id: string
    name: string
    price: number
  }>
  total_price: number
}

// Helper to get the base URL for internal API calls
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

// Function to fetch real addon prices from our internal API
async function fetchRealAddonPrices(productId: number): Promise<Record<string, number>> {
  try {
    const baseUrl = getBaseUrl()
    console.log(`Fetching real addon prices for product ID: ${productId} using base URL: ${baseUrl}`)

    const response = await fetch(`${baseUrl}/api/woocommerce/product-addons/${productId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.warn(`Failed to fetch addons: ${response.status}`, errorData)
      return {}
    }

    const data = await response.json()
    console.log("Real addon data from API:", JSON.stringify(data, null, 2))

    if (data.error || !data.addons || !Array.isArray(data.addons)) {
      console.warn("No addons found or invalid format in internal API response")
      return {}
    }

    const realAddonMap: Record<string, number> = {}
    for (const addon of data.addons) {
      const realPrice =
        addon.discounted && addon.sale_price ? Number.parseFloat(addon.sale_price) : Number.parseFloat(addon.price)
      realAddonMap[addon.name] = realPrice // Use name as the key for consistency with frontend
    }
    return realAddonMap
  } catch (error) {
    console.error("Error fetching real addon prices:", error)
    return {}
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ValidationRequest = await request.json()
    if (!data.product_id) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 })
    }

    const [product, realAddonMap] = await Promise.all([
      fetchProductById(data.product_id),
      fetchRealAddonPrices(data.product_id),
    ])

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const currentBasePrice = Number.parseFloat(product.price)
    const basePriceChanged = Math.abs(currentBasePrice - data.base_price) > 1
    if (basePriceChanged) {
      return NextResponse.json(
        {
          valid: false,
          error: "BASE_PRICE_CHANGED",
          message: "The service price has been updated.",
          current_base_price: currentBasePrice,
        },
        { status: 409 },
      )
    }

    let calculatedAddonTotal = 0
    for (const addon of data.addons) {
      const realAddonPrice = realAddonMap[addon.name] ?? 0
      if (Math.abs(addon.price - realAddonPrice) > 1) {
        return NextResponse.json(
          {
            valid: false,
            error: "ADDON_PRICE_CHANGED",
            message: `The price for "${addon.name}" has been updated.`,
            addon_name: addon.name,
            current_addon_price: realAddonPrice,
          },
          { status: 409 },
        )
      }
      calculatedAddonTotal += realAddonPrice
    }

    const expectedTotal = currentBasePrice + calculatedAddonTotal
    if (Math.abs(expectedTotal - data.total_price) > 1) {
      return NextResponse.json(
        {
          valid: false,
          error: "TOTAL_CALCULATION_ERROR",
          message: `Price calculation error. Expected RS ${expectedTotal}, but got RS ${data.total_price}.`,
          expected_total: expectedTotal,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({
      valid: true,
      message: "Pricing validation successful",
      validated_data: {
        real_addon_prices: realAddonMap,
      },
    })
  } catch (error) {
    console.error("❌ Price validation error:", error)
    return NextResponse.json({ valid: false, error: "VALIDATION_ERROR" }, { status: 500 })
  }
}
