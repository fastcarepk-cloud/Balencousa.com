import { NextRequest, NextResponse } from "next/server"
import { fetchOrdersByCustomerEmail } from "@/lib/woocommerce-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    console.log("=== FETCHING ORDERS FOR EMAIL ===", email)

    // Fetch orders from WooCommerce using the improved function
    const wooOrders = await fetchOrdersByCustomerEmail(email)
    console.log("Raw WooCommerce orders found:", wooOrders.length)

    // Transform orders to the format expected by the frontend
    const transformedOrders = wooOrders.map(order => {
      console.log("Processing order:", order.id, "Status:", order.status)
      
      // Transform line items to include proper product IDs
      const itemsWithProductIds = order.line_items?.map(item => {
        console.log("Line item:", item.name, "Product ID:", item.product_id)
        return {
          id: item.id || 0,
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.total) / item.quantity,
          total: parseFloat(item.total),
          productId: item.product_id // This is crucial for reviews
        }
      }) || []

      return {
        id: order.id!,
        orderNumber: order.number || order.id!.toString(),
        status: order.status!,
        date: order.date_created!,
        time: order.date_created ? new Date(order.date_created).toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }) : undefined,
        total: parseFloat(order.total || "0"),
        items: itemsWithProductIds,
        customerName: `${order.billing.first_name} ${order.billing.last_name}`,
        customerEmail: order.billing.email,
        customerPhone: order.billing.phone,
        billingAddress: order.billing,
        shippingAddress: order.shipping
      }
    })

    // Sort by date (newest first)
    transformedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log("=== FINAL TRANSFORMED ORDERS ===", transformedOrders.length)
    transformedOrders.forEach(order => {
      console.log(`Order ${order.orderNumber}: ${order.items.length} items, Status: ${order.status}`)
      order.items.forEach(item => {
        console.log(`  - ${item.name} (Product ID: ${item.productId})`)
      })
    })

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      debug: {
        email,
        totalFound: transformedOrders.length,
        counts: {
          merged: transformedOrders.length
        }
      }
    })

  } catch (error) {
    console.error("=== ERROR FETCHING USER ORDERS ===", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch orders", 
        details: error instanceof Error ? error.message : "Unknown error",
        orders: []
      },
      { status: 500 }
    )
  }
}
