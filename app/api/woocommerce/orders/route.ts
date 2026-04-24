import { type NextRequest, NextResponse } from "next/server"
import { createWooCommerceOrder, fetchProductById } from "@/lib/woocommerce-api"

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
    if (data.error || !data.addons || !Array.isArray(data.addons)) {
      console.warn("No addons found or invalid format in internal API response")
      return {}
    }

    const realAddonMap: Record<string, number> = {}
    for (const addon of data.addons) {
      const realPrice =
        addon.discounted && addon.sale_price ? Number.parseFloat(addon.sale_price) : Number.parseFloat(addon.price)
      realAddonMap[addon.name] = realPrice // Use name as the key
    }
    return realAddonMap
  } catch (error) {
    console.error("Error fetching real addon prices:", error)
    return {}
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    console.log("Received booking data:", JSON.stringify(bookingData, null, 2))

    // Validate required fields - using the actual field names from the form
    const requiredFields = [
      "productId",
      "firstName",
      "lastName",
      "email",
      "phone",
      "city",
      "address",
      "appointmentDate",
      "appointmentTime",
      "price",
      "basePrice",
    ]

    const missingFields = requiredFields.filter((field) => !bookingData[field])

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields)
      return NextResponse.json(
        {
          error: "MISSING_REQUIRED_FIELDS",
          message: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 },
      )
    }

    const [product, realAddonMap] = await Promise.all([
      fetchProductById(bookingData.productId),
      fetchRealAddonPrices(bookingData.productId),
    ])

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const currentBasePrice = Number.parseFloat(product.price)
    if (Math.abs(currentBasePrice - bookingData.basePrice) > 1) {
      return NextResponse.json({ error: "BASE_PRICE_CHANGED" }, { status: 409 })
    }

    let calculatedAddonTotal = 0
    const addOnsForOrder = []
    for (const addonName of bookingData.selectedAddOns || []) {
      const addonPrice = realAddonMap[addonName] ?? 0
      calculatedAddonTotal += addonPrice
      addOnsForOrder.push(`${addonName} (RS ${addonPrice})`)
    }

    const expectedTotal = currentBasePrice + calculatedAddonTotal
    if (Math.abs(expectedTotal - bookingData.price) > 1) {
      return NextResponse.json({ error: "TOTAL_CALCULATION_ERROR" }, { status: 409 })
    }

    const addOnsInfo = addOnsForOrder.length > 0 ? addOnsForOrder.join(", ") : "None"

    // Format appointment date and time for display
    const appointmentDate = new Date(bookingData.appointmentDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Enhanced customer note with all details
    const customerNote = `
      Salon Service Booking Details:
      - Service: ${product.name}
      - Customer: ${bookingData.firstName} ${bookingData.lastName}
      - Email: ${bookingData.email}
      - Phone: ${bookingData.phone}
      - Location: ${bookingData.address}, ${bookingData.area}, ${bookingData.city}
      - Appointment Date: ${appointmentDate}
      - Appointment Time: ${bookingData.appointmentTime}
      - Add-ons: ${addOnsInfo}
      - Special Instructions: ${bookingData.specialInstructions || "None"}
      - Total Amount: RS ${expectedTotal}
      
      Please contact customer to confirm appointment details.
    `.trim()

    const orderData = {
      status: "processing", // Changed from "pending" to "processing"
      currency: "PKR",
      payment_method: "cod",
      payment_method_title: "Cash After Services",
      customer_note: customerNote,
      billing: {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        address_1: bookingData.address,
        city: bookingData.city,
        state: bookingData.state || "Punjab",
        country: "PK",
      },
      shipping: {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        address_1: bookingData.address,
        city: bookingData.city,
        state: bookingData.state || "Punjab",
        country: "PK",
      },
      line_items: [
        {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          total: expectedTotal.toString(),
          subtotal: currentBasePrice.toString(),
        },
      ],
      meta_data: [
        { key: "service_location", value: `${bookingData.address}, ${bookingData.area}, ${bookingData.city}` },
        { key: "selected_addons", value: addOnsInfo },
        { key: "addon_total", value: calculatedAddonTotal.toString() },
        { key: "base_price", value: currentBasePrice.toString() },
        { key: "appointment_date", value: bookingData.appointmentDate },
        { key: "appointment_time", value: bookingData.appointmentTime },
        { key: "appointment_date_formatted", value: appointmentDate },
        { key: "special_instructions", value: bookingData.specialInstructions || "" },
        { key: "customer_email", value: bookingData.email },
        { key: "customer_phone", value: bookingData.phone },
        { key: "booking_source", value: "website" },
        { key: "booking_timestamp", value: new Date().toISOString() },
        { key: "order_type", value: "salon_booking" }, // Added to identify salon bookings
        { key: "booking_status", value: "confirmed" }, // Added booking status
      ],
    }

    console.log("Creating order with enhanced data:", JSON.stringify(orderData, null, 2))

    const order = await createWooCommerceOrder(orderData)
    if (order) {
      // Log successful order creation with all details
      console.log("Order created successfully with processing status:", {
        orderId: order.id,
        orderNumber: order.number,
        status: order.status || "processing",
        customerName: `${bookingData.firstName} ${bookingData.lastName}`,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime,
        specialInstructions: bookingData.specialInstructions,
        total: expectedTotal,
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.number,
        status: order.status || "processing", // Return the order status
        appointmentDetails: {
          date: bookingData.appointmentDate,
          time: bookingData.appointmentTime,
          formattedDate: appointmentDate,
        },
      })
    } else {
      throw new Error("Failed to create order")
    }
  } catch (error) {
    console.error("Error creating WooCommerce order:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Enhanced error handling with specific error types
    if (errorMessage.includes("401") || errorMessage.includes("403")) {
      return NextResponse.json(
        {
          error: "AUTHENTICATION_FAILED",
          message: "Authentication failed. Please try again or contact support.",
        },
        { status: 500 },
      )
    }

    if (errorMessage.includes("400")) {
      return NextResponse.json(
        {
          error: "INVALID_DATA",
          message: "Invalid booking data. Please check all fields and try again.",
        },
        { status: 400 },
      )
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return NextResponse.json(
        {
          error: "NETWORK_ERROR",
          message: "Network error. Please check your connection and try again.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        error: "BOOKING_FAILED",
        message: "Failed to create booking. Please try again or contact support.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    )
  }
}
