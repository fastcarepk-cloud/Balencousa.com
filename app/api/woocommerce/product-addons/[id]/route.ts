import { type NextRequest, NextResponse } from "next/server"

// Cache for addon data
const addonCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 60 seconds

// Mock addon data generator based on service type
const generateMockAddons = (productId: string) => {
  const serviceType = detectServiceType(productId)

  const addonsByType = {
    hair: [
      {
        id: 1,
        name: "Deep Conditioning Treatment",
        description: "Intensive moisturizing treatment for damaged hair",
        price: 800,
        type: "checkbox",
        required: false,
      },
      {
        id: 2,
        name: "Relaxing Scalp Massage",
        description: "10-minute therapeutic scalp massage with essential oils",
        price: 500,
        type: "checkbox",
        required: false,
      },
      {
        id: 3,
        name: "Premium Hair Serum Application",
        description: "Professional-grade serum for shine and protection",
        price: 600,
        type: "checkbox",
        required: false,
      },
    ],
    facial: [
      {
        id: 4,
        name: "Under-Eye Treatment",
        description: "Specialized treatment for dark circles and puffiness",
        price: 700,
        type: "checkbox",
        required: false,
      },
      {
        id: 5,
        name: "Premium Face Mask",
        description: "Hydrating collagen mask for glowing skin",
        price: 900,
        type: "checkbox",
        required: false,
      },
      {
        id: 6,
        name: "Neck & Décolletage Care",
        description: "Anti-aging treatment for neck and chest area",
        price: 600,
        type: "checkbox",
        required: false,
      },
    ],
    makeup: [
      {
        id: 7,
        name: "Premium False Lashes",
        description: "High-quality individual or strip lashes",
        price: 400,
        type: "checkbox",
        required: false,
      },
      {
        id: 8,
        name: "Professional Contouring",
        description: "Advanced contouring and highlighting techniques",
        price: 800,
        type: "checkbox",
        required: false,
      },
      {
        id: 9,
        name: "Long-lasting Setting Spray",
        description: "Professional makeup setting spray for all-day wear",
        price: 300,
        type: "checkbox",
        required: false,
      },
    ],
    massage: [
      {
        id: 10,
        name: "Aromatherapy Enhancement",
        description: "Essential oil blend for relaxation and stress relief",
        price: 500,
        type: "checkbox",
        required: false,
      },
      {
        id: 11,
        name: "Hot Stone Therapy",
        description: "Heated stones for deeper muscle relaxation",
        price: 1000,
        type: "checkbox",
        required: false,
      },
      {
        id: 12,
        name: "Extended Session (+30 min)",
        description: "Additional 30 minutes of massage therapy",
        price: 800,
        type: "checkbox",
        required: false,
      },
    ],
    waxing: [
      {
        id: 13,
        name: "Soothing Aloe Treatment",
        description: "Post-wax soothing treatment with aloe vera",
        price: 300,
        type: "checkbox",
        required: false,
      },
      {
        id: 14,
        name: "Premium Wax Upgrade",
        description: "Hypoallergenic wax for sensitive skin",
        price: 400,
        type: "checkbox",
        required: false,
      },
      {
        id: 15,
        name: "Ingrown Hair Prevention",
        description: "Specialized treatment to prevent ingrown hairs",
        price: 500,
        type: "checkbox",
        required: false,
      },
    ],
    mehndi: [
      {
        id: 16,
        name: "Intricate Design Upgrade",
        description: "More detailed and elaborate henna patterns",
        price: 600,
        type: "checkbox",
        required: false,
      },
      {
        id: 17,
        name: "Natural Henna Paste",
        description: "100% natural, chemical-free henna paste",
        price: 200,
        type: "checkbox",
        required: false,
      },
      {
        id: 18,
        name: "Hand & Foot Combo",
        description: "Beautiful designs for both hands and feet",
        price: 1200,
        type: "checkbox",
        required: false,
      },
    ],
  }

  const addons = addonsByType[serviceType] || addonsByType.hair

  // Return 2-3 random addons for variety
  const shuffled = [...addons].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2)
}

// Detect service type from product ID
const detectServiceType = (productId: string): keyof typeof addonsByType => {
  const id = productId.toLowerCase()

  if (id.includes("hair") || id.includes("protein") || id.includes("treatment") || id.includes("styling")) {
    return "hair"
  } else if (id.includes("facial") || id.includes("face") || id.includes("skin")) {
    return "facial"
  } else if (id.includes("makeup") || id.includes("bridal") || id.includes("party")) {
    return "makeup"
  } else if (id.includes("massage") || id.includes("therapy")) {
    return "massage"
  } else if (id.includes("wax") || id.includes("waxing")) {
    return "waxing"
  } else if (id.includes("mehndi") || id.includes("henna")) {
    return "mehndi"
  }

  return "hair" // default
}

const addonsByType = {
  hair: [
    {
      id: 1,
      name: "Deep Conditioning Treatment",
      description: "Intensive moisturizing treatment for damaged hair",
      price: 800,
      type: "checkbox",
      required: false,
    },
    {
      id: 2,
      name: "Relaxing Scalp Massage",
      description: "10-minute therapeutic scalp massage with essential oils",
      price: 500,
      type: "checkbox",
      required: false,
    },
    {
      id: 3,
      name: "Premium Hair Serum Application",
      description: "Professional-grade serum for shine and protection",
      price: 600,
      type: "checkbox",
      required: false,
    },
  ],
  facial: [
    {
      id: 4,
      name: "Under-Eye Treatment",
      description: "Specialized treatment for dark circles and puffiness",
      price: 700,
      type: "checkbox",
      required: false,
    },
    {
      id: 5,
      name: "Premium Face Mask",
      description: "Hydrating collagen mask for glowing skin",
      price: 900,
      type: "checkbox",
      required: false,
    },
    {
      id: 6,
      name: "Neck & Décolletage Care",
      description: "Anti-aging treatment for neck and chest area",
      price: 600,
      type: "checkbox",
      required: false,
    },
  ],
  makeup: [
    {
      id: 7,
      name: "Premium False Lashes",
      description: "High-quality individual or strip lashes",
      price: 400,
      type: "checkbox",
      required: false,
    },
    {
      id: 8,
      name: "Professional Contouring",
      description: "Advanced contouring and highlighting techniques",
      price: 800,
      type: "checkbox",
      required: false,
    },
    {
      id: 9,
      name: "Long-lasting Setting Spray",
      description: "Professional makeup setting spray for all-day wear",
      price: 300,
      type: "checkbox",
      required: false,
    },
  ],
  massage: [
    {
      id: 10,
      name: "Aromatherapy Enhancement",
      description: "Essential oil blend for relaxation and stress relief",
      price: 500,
      type: "checkbox",
      required: false,
    },
    {
      id: 11,
      name: "Hot Stone Therapy",
      description: "Heated stones for deeper muscle relaxation",
      price: 1000,
      type: "checkbox",
      required: false,
    },
    {
      id: 12,
      name: "Extended Session (+30 min)",
      description: "Additional 30 minutes of massage therapy",
      price: 800,
      type: "checkbox",
      required: false,
    },
  ],
  waxing: [
    {
      id: 13,
      name: "Soothing Aloe Treatment",
      description: "Post-wax soothing treatment with aloe vera",
      price: 300,
      type: "checkbox",
      required: false,
    },
    {
      id: 14,
      name: "Premium Wax Upgrade",
      description: "Hypoallergenic wax for sensitive skin",
      price: 400,
      type: "checkbox",
      required: false,
    },
    {
      id: 15,
      name: "Ingrown Hair Prevention",
      description: "Specialized treatment to prevent ingrown hairs",
      price: 500,
      type: "checkbox",
      required: false,
    },
  ],
  mehndi: [
    {
      id: 16,
      name: "Intricate Design Upgrade",
      description: "More detailed and elaborate henna patterns",
      price: 600,
      type: "checkbox",
      required: false,
    },
    {
      id: 17,
      name: "Natural Henna Paste",
      description: "100% natural, chemical-free henna paste",
      price: 200,
      type: "checkbox",
      required: false,
    },
    {
      id: 18,
      name: "Hand & Foot Combo",
      description: "Beautiful designs for both hands and feet",
      price: 1200,
      type: "checkbox",
      required: false,
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    console.log(`🔍 Fetching addons for product: ${productId}`)

    // Check cache first
    const cacheKey = `addons_${productId}`
    const cached = addonCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Returning cached addons for ${productId}`)
      return NextResponse.json(cached.data)
    }

    // Method 1: Try custom addon API endpoint
    try {
      console.log("🔗 Attempting custom addon API...")
      const customResponse = await fetch(`https://store.glamup.pk/wp-json/azmat/v1/product/${productId}/addons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (customResponse.ok) {
        const customData = await customResponse.json()
        console.log("✅ Custom addon API successful")

        // Cache the result
        addonCache.set(cacheKey, { data: customData, timestamp: Date.now() })
        return NextResponse.json(customData)
      } else {
        console.log(`❌ Custom addon API failed: ${customResponse.status}`)
      }
    } catch (customError) {
      console.log("❌ Custom addon API error:", customError)
    }

    // Method 2: Try WooCommerce Product Add-ons API
    try {
      console.log("🔗 Attempting WooCommerce Product Add-ons API...")
      const consumerKey = "ck_ee6caedb32b454b2ab72b99b7cb6e99efed9af4a"
      const consumerSecret = "cs_753e19303eb3fcae13e7d5c88d9b38230ec0a677"

      const wooResponse = await fetch(
        `https://store.glamup.pk/wp-json/wc/v3/products/${productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      )

      if (wooResponse.ok) {
        const productData = await wooResponse.json()

        // Check if product has add-ons in meta data
        if (productData.meta_data) {
          const addonsData = productData.meta_data.find(
            (meta: any) => meta.key === "_product_addons" || meta.key === "product_addons",
          )

          if (addonsData && addonsData.value) {
            console.log("✅ WooCommerce addons found in product meta")
            const result = { addons: addonsData.value }
            addonCache.set(cacheKey, { data: result, timestamp: Date.now() })
            return NextResponse.json(result)
          }
        }

        console.log("⚠️ No addons found in WooCommerce product data")
      } else {
        console.log(`❌ WooCommerce API failed: ${wooResponse.status}`)
      }
    } catch (wooError) {
      console.log("❌ WooCommerce API error:", wooError)
    }

    // Method 3: Generate smart mock addons based on service type
    console.log("🎭 Generating smart mock addons...")
    const mockAddons = generateMockAddons(productId)
    const result = { addons: mockAddons }

    // Cache the mock result
    addonCache.set(cacheKey, { data: result, timestamp: Date.now() })

    console.log(`✅ Generated ${mockAddons.length} mock addons for ${productId}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 Addon API error:", error)

    // Even in case of complete failure, return basic addons
    const fallbackAddons = [
      {
        id: 999,
        name: "Premium Service Upgrade",
        description: "Enhanced service with premium products",
        price: 500,
        type: "checkbox",
        required: false,
      },
    ]

    return NextResponse.json({ addons: fallbackAddons })
  }
}
