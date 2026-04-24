import { type NextRequest, NextResponse } from "next/server"
import { fetchOrderById } from "@/lib/woocommerce-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          error: "Invalid order ID",
          code: "INVALID_ORDER_ID",
        },
        { status: 400 },
      )
    }

    const order = await fetchOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
          code: "ORDER_NOT_FOUND",
        },
        { status: 404 },
      )
    }

    // Extract appointment details from meta data
    const metaData = order.meta_data || []
    const getMetaValue = (key: string) => {
      const meta = metaData.find((item: any) => item.key === key)
      return meta ? meta.value : null
    }

    // Format the order data for frontend consumption
    const formattedOrder = {
      id: order.id,
      number: order.number,
      status: order.status,
      total: order.total,
      currency: order.currency,
      date_created: order.date_created,
      customer: {
        firstName: order.billing?.first_name || "",
        lastName: order.billing?.last_name || "",
        email: order.billing?.email || "",
        phone: order.billing?.phone || "",
      },
      appointment: {
        date: getMetaValue("appointment_date"),
        time: getMetaValue("appointment_time"),
        formattedDate: getMetaValue("appointment_date_formatted"),
        location: getMetaValue("service_location"),
      },
      service: {
        name: order.line_items?.[0]?.name || "",
        basePrice: getMetaValue("base_price"),
        addonsTotal: getMetaValue("addon_total"),
        selectedAddons: getMetaValue("selected_addons"),
      },
      booking: {
        id: getMetaValue("booking_id"),
        source: getMetaValue("booking_source"),
        timestamp: getMetaValue("booking_timestamp"),
        specialInstructions: getMetaValue("special_instructions"),
      },
      customerNote: order.customer_note,
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    })
  } catch (error) {
    console.error("Error fetching order:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch order details",
        code: "FETCH_ERROR",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}
