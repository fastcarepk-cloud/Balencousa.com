import axios from "axios"

const BASE_URL = process.env.WC_BASE_URL || "https://balencousa.com/wp-json/wc/v3"
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "ck_cb4f71b4b58874783557d1966e5f375253210d6e"
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "cs_c2dc7e9802e8f9af3cdbeecea4e66fcc804cf603"

// Enhanced security and validation utilities
function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 1000) // Limit length
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false

  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, "")

  // Must have at least 7 digits and at most 15 digits (international standard)
  const digitCount = cleanPhone.replace(/^\+/, "").length

  if (digitCount < 7 || digitCount > 15) return false

  // Pakistani mobile number patterns
  const pakistaniMobile = /^(\+92|92|0)?3[0-9]{9}$/
  const pakistaniLandline = /^(\+92|92|0)?[2-9][0-9]{7,8}$/
  const internationalPattern = /^\+[1-9][0-9]{6,14}$/

  return (
    pakistaniMobile.test(cleanPhone) ||
    pakistaniLandline.test(cleanPhone) ||
    internationalPattern.test(cleanPhone) ||
    /^[0-9]{7,15}$/.test(cleanPhone)
  ) // Simple digit pattern as fallback
}

async function fetchFromWooCommerce(
  endpoint: string,
  params: Record<string, any> = {},
  method = "GET",
  body?: any,
): Promise<any> {
  const searchParams = new URLSearchParams({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    ...params,
  })

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`

  try {
    console.log(`${method} request to:`, url)

    // Use axios instead of fetch for better compatibility
    const config: any = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GlamUp-Salon-App/1.0",
      },
      timeout: 15000, // 15 second timeout
    }

    // Add body for POST/PUT requests
    if (body && (method === "POST" || method === "PUT")) {
      config.data = body
    }

    const response = await axios(config)
    
    console.log(`${method} response:`, Array.isArray(response.data) ? `${response.data.length} items` : "Single item")
    return response.data
  } catch (error: any) {
    console.error("WooCommerce API Error:", error.message || error)
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout")
    } else if (error.response) {
      console.error(`HTTP error! status: ${error.response.status}, data:`, error.response.data)
    } else if (error.request) {
      console.error("No response received:", error.request)
    }
    
    if (method === "GET") {
      return []
    }
    throw error
  }
}

// WooCommerce API types
export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  stock_status: string
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  related_ids: number[]
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  images: Array<{
    id: number
    date_created: string
    date_modified: string
    src: string
    name: string
    alt: string
  }>
  attributes: any[]
  default_attributes: any[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  meta_data: any[]
}

export interface WooCommerceCategory {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: string
  image: {
    id: number
    date_created: string
    date_modified: string
    src: string
    name: string
    alt: string
  } | null
  menu_order: number
  count: number
}

export interface WooCommerceReview {
  id: number
  date_created: string
  date_created_gmt: string
  product_id: number
  status: string
  reviewer: string
  reviewer_email: string
  review: string
  rating: number
  verified: boolean
  reviewer_avatar_urls: {
    "24": string
    "48": string
    "96": string
  }
}

export interface WooCommerceOrder {
  id?: number
  parent_id?: number
  status?: string
  currency?: string
  version?: string
  prices_include_tax?: boolean
  date_created?: string
  date_modified?: string
  discount_total?: string
  discount_tax?: string
  shipping_total?: string
  shipping_tax?: string
  cart_tax?: string
  total?: string
  total_tax?: string
  customer_id?: number
  order_key?: string
  billing: {
    first_name: string
    last_name: string
    company?: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode?: string
    country: string
    email: string
    phone: string
  }
  shipping: {
    first_name: string
    last_name: string
    company?: string
    address_1: string
    address_2?: string
    city: string
    state: string
    postcode?: string
    country: string
  }
  payment_method?: string
  payment_method_title?: string
  transaction_id?: string
  customer_ip_address?: string
  customer_user_agent?: string
  created_via?: string
  customer_note?: string
  date_completed?: string
  date_paid?: string
  cart_hash?: string
  number?: string
  meta_data?: Array<{
    id?: number
    key: string
    value: any
  }>
  line_items: Array<{
    id?: number
    name: string
    product_id: number
    variation_id?: number
    quantity: number
    tax_class?: string
    subtotal: string
    subtotal_tax?: string
    total: string
    total_tax?: string
    taxes?: any[]
    meta_data?: Array<{
      id?: number
      key: string
      value: any
    }>
    sku?: string
    price?: number
  }>
  tax_lines?: any[]
  shipping_lines?: any[]
  fee_lines?: any[]
  coupon_lines?: any[]
  refunds?: any[]
}

export interface Booking {
  id: number
  orderNumber: string
  service: string
  stylist: string
  date: string
  time: string
  location: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  amount: number
  createdAt: string
}

// Fetch all categories - using exact endpoint from developer
export async function fetchWooCommerceCategories(): Promise<WooCommerceCategory[]> {
  try {
    const categories = await fetchFromWooCommerce("/products/categories", {
      per_page: "100",
    })
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Fetch all products - using exact endpoint from developer
export async function fetchWooCommerceProducts(): Promise<WooCommerceProduct[]> {
  try {
    const products = await fetchFromWooCommerce("/products", {
      per_page: "100",
    })
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Fetch products by category ID - using exact endpoint from developer
export async function fetchProductsByCategory(categoryId: number): Promise<WooCommerceProduct[]> {
  try {
    const products = await fetchFromWooCommerce("/products", {
      category: categoryId.toString(),
      per_page: "100",
    })
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

// Fetch single product by slug - using exact endpoint from developer
export async function fetchProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
  try {
    const products = await fetchFromWooCommerce("/products", {
      slug: slug,
    })
    return products && Array.isArray(products) && products.length > 0 ? products[0] : null
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

// Fetch product by ID - using exact endpoint from developer
export async function fetchProductById(productId: number): Promise<WooCommerceProduct | null> {
  try {
    const product = await fetchFromWooCommerce(`/products/${productId}`)
    return product || null
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

// Fetch order by ID
export async function fetchOrderById(orderId: number): Promise<WooCommerceOrder | null> {
  try {
    const order = await fetchFromWooCommerce(`/orders/${orderId}`)
    return order || null
  } catch (error) {
    console.error("Error fetching order by ID:", error)
    return null
  }
}

// Fetch orders by customer ID
export async function fetchOrdersByCustomerId(customerId: number): Promise<WooCommerceOrder[]> {
  try {
    console.log("Fetching orders for customer ID:", customerId)
    const orders = await fetchFromWooCommerce("/orders", {
      customer: customerId.toString(),
      per_page: "100",
      orderby: "date",
      order: "desc"
    })
    console.log("Raw orders response:", orders)
    return Array.isArray(orders) ? orders : []
  } catch (error) {
    console.error("Error fetching orders by customer ID:", error)
    return []
  }
}

// Fetch orders by customer email - FIXED VERSION
export async function fetchOrdersByCustomerEmail(customerEmail: string): Promise<WooCommerceOrder[]> {
  try {
    console.log("Fetching orders for customer email:", customerEmail)
    
    // Method 1: Try to find customer by email first
    let customerId: number | null = null
    try {
      const customers = await fetchFromWooCommerce("/customers", {
        email: customerEmail,
        per_page: "1"
      })
      if (Array.isArray(customers) && customers.length > 0) {
        customerId = customers[0].id
        console.log("Found customer ID:", customerId)
      }
    } catch (customerError) {
      console.warn("Could not fetch customer by email:", customerError)
    }

    // Method 2: Fetch orders by customer ID if found
    let ordersByCustomerId: WooCommerceOrder[] = []
    if (customerId) {
      try {
        ordersByCustomerId = await fetchFromWooCommerce("/orders", {
          customer: customerId.toString(),
          per_page: "100",
          orderby: "date",
          order: "desc"
        })
        console.log("Orders by customer ID:", ordersByCustomerId.length)
      } catch (orderError) {
        console.warn("Could not fetch orders by customer ID:", orderError)
      }
    }

    // Method 3: Search orders by email (fallback)
    let ordersBySearch: WooCommerceOrder[] = []
    try {
      const searchResults = await fetchFromWooCommerce("/orders", {
        search: customerEmail,
        per_page: "100",
        orderby: "date",
        order: "desc"
      })
      if (Array.isArray(searchResults)) {
        // Filter to exact email matches only
        ordersBySearch = searchResults.filter((order: any) => 
          order?.billing?.email?.toLowerCase() === customerEmail.toLowerCase()
        )
        console.log("Orders by search (filtered):", ordersBySearch.length)
      }
    } catch (searchError) {
      console.warn("Could not search orders by email:", searchError)
    }

    // Combine and deduplicate orders
    const allOrders = [...ordersByCustomerId, ...ordersBySearch]
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    )

    console.log("Total unique orders found:", uniqueOrders.length)
    return uniqueOrders

  } catch (error) {
    console.error("Error fetching orders by customer email:", error)
    return []
  }
}

// Fetch category by slug
export async function fetchCategoryBySlug(slug: string): Promise<WooCommerceCategory | null> {
  try {
    const categories = await fetchFromWooCommerce("/products/categories", {
      slug: slug,
    })
    return categories && Array.isArray(categories) && categories.length > 0 ? categories[0] : null
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return null
  }
}

// Fetch reviews for a product - using exact endpoint from developer
export async function fetchProductReviews(productId: number): Promise<WooCommerceReview[]> {
  try {
    const reviews = await fetchFromWooCommerce("/products/reviews", {
      product: productId.toString(),
      per_page: "100",
      status: "approved", // Only fetch approved reviews
    })
    return Array.isArray(reviews) ? reviews : []
  } catch (error) {
    console.error("Error fetching product reviews:", error)
    return []
  }
}

// Enhanced create WooCommerce order with improved validation and security
export async function createWooCommerceOrder(orderData: WooCommerceOrder): Promise<WooCommerceOrder | null> {
  try {
    // Enhanced validation
    if (!orderData.billing?.email || !validateEmail(orderData.billing.email)) {
      throw new Error("Invalid email address")
    }

    if (!orderData.billing?.phone || !validatePhone(orderData.billing.phone)) {
      console.error("Phone validation failed for:", orderData.billing.phone)
      throw new Error(
        `Invalid phone number: ${orderData.billing.phone}. Please use a valid format like +923001234567 or 03001234567`,
      )
    }

    if (!orderData.line_items || orderData.line_items.length === 0) {
      throw new Error("No line items provided")
    }

    // Sanitize all string inputs
    const sanitizedOrderData = {
      ...orderData,
      billing: {
        ...orderData.billing,
        first_name: sanitizeInput(orderData.billing.first_name),
        last_name: sanitizeInput(orderData.billing.last_name),
        email: sanitizeInput(orderData.billing.email),
        phone: sanitizeInput(orderData.billing.phone),
        address_1: sanitizeInput(orderData.billing.address_1),
        city: sanitizeInput(orderData.billing.city),
        state: sanitizeInput(orderData.billing.state),
        country: sanitizeInput(orderData.billing.country),
      },
      shipping: {
        ...orderData.shipping,
        first_name: sanitizeInput(orderData.shipping.first_name),
        last_name: sanitizeInput(orderData.shipping.last_name),
        address_1: sanitizeInput(orderData.shipping.address_1),
        city: sanitizeInput(orderData.shipping.city),
        state: sanitizeInput(orderData.shipping.state),
        country: sanitizeInput(orderData.shipping.country),
      },
      customer_note: orderData.customer_note ? sanitizeInput(orderData.customer_note) : "",
    }

    console.log("Creating WooCommerce order with enhanced validation:", JSON.stringify(sanitizedOrderData, null, 2))

    const order = await fetchFromWooCommerce("/orders", {}, "POST", sanitizedOrderData)

    if (order && order.id) {
      console.log("Order created successfully:", order.id)
      return order
    } else {
      console.error("Order creation failed - no order ID returned")
      throw new Error("Order creation failed")
    }
  } catch (error) {
    console.error("Error creating WooCommerce order:", error)

    // Re-throw with more specific error information
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new Error("Authentication failed - check API credentials")
      } else if (error.message.includes("400")) {
        throw new Error("Invalid order data provided")
      } else if (error.message.includes("403")) {
        throw new Error("Insufficient permissions to create orders")
      }
    }

    throw error
  }
}

// Client-side API for checkout validation
export async function validateProductData(productId: number): Promise<WooCommerceProduct | null> {
  try {
    const response = await fetch(`/api/woocommerce/product/${productId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error validating product data:", error)
    return null
  }
}

// Enhanced product validation for checkout
export async function validateCheckoutProduct(
  productId: number,
  expectedPrice: number,
): Promise<{
  valid: boolean
  currentPrice?: number
  product?: WooCommerceProduct
  error?: string
}> {
  try {
    const response = await fetch(`/api/woocommerce/product/${productId}`)
    if (!response.ok) {
      return { valid: false, error: "Product not found" }
    }

    const product: WooCommerceProduct = await response.json()
    const currentPrice = Number.parseFloat(product.price)

    // Allow 1% tolerance for price differences due to rounding
    const priceValid = Math.abs(currentPrice - expectedPrice) <= currentPrice * 0.01

    return {
      valid: priceValid && product.status === "publish",
      currentPrice,
      product,
      error: !priceValid ? "Price has changed" : product.status !== "publish" ? "Product unavailable" : undefined,
    }
  } catch (error) {
    console.error("Error validating checkout product:", error)
    return { valid: false, error: "Validation failed" }
  }
}

// Enhanced HTML stripping utility function
function stripHtmlTags(html: string): string {
  if (typeof html !== "string" || !html) return ""

  let cleanText = html

  // First, handle HTML entities like &lt; &gt; &amp; etc.
  const entityMap: { [key: string]: string } = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
  }

  // Replace HTML entities first
  Object.keys(entityMap).forEach((entity) => {
    const regex = new RegExp(entity, "gi")
    cleanText = cleanText.replace(regex, entityMap[entity])
  })

  // Handle numeric HTML entities like &#8217; &#8220; etc.
  cleanText = cleanText.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec)
  })

  // Handle hex HTML entities like &#x2019; etc.
  cleanText = cleanText.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(Number.parseInt(hex, 16))
  })

  // Remove HTML tags - comprehensive regex that handles nested tags, attributes, and malformed HTML
  cleanText = cleanText.replace(/<\/?[^>]*>/g, "")

  // Remove any remaining HTML-like patterns and entities
  cleanText = cleanText.replace(/&[a-zA-Z0-9#]+;/g, "")

  // Clean up extra whitespace and normalize
  cleanText = cleanText.replace(/\s+/g, " ").trim()

  // Remove any remaining angle brackets that might be left
  cleanText = cleanText.replace(/[<>]/g, "")

  return cleanText
}

// Transform WooCommerce data to match existing structure
export function transformWooCommerceCategory(category: WooCommerceCategory) {
  return {
    id: category.id,
    name: stripHtmlTags(category.name),
    slug: category.slug,
    description: stripHtmlTags(category.description),
    image: category.image?.src || "/images/mehndi-service.jpg",
    count: category.count,
  }
}

export function transformWooCommerceProduct(product: WooCommerceProduct) {
  const price = Number.parseFloat(product.price) || 0
  const regularPrice = Number.parseFloat(product.regular_price) || price

  return {
    id: product.id,
    name: stripHtmlTags(product.name),
    slug: product.slug,
    shortDescription: stripHtmlTags(product.short_description),
    longDescription: stripHtmlTags(product.description),
    price: price,
    originalPrice: regularPrice,
    discount: product.on_sale && regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0,
    image: product.images && product.images.length > 0 ? product.images[0].src : "/images/mehndi-service.jpg",
    rating: Number.parseFloat(product.average_rating) || 4.5,
    reviewCount: product.rating_count || 0,
    duration: product.meta_data.find((m) => m.key === "_wc_booking_duration")?.value ?? "60 min", // Default duration for services
    featured: product.featured,
    inStock: product.stock_status === "instock",
    categories: product.categories,
    gallery: product.images?.map((img) => img.src) || [],
  }
}

export function transformWooCommerceReview(review: WooCommerceReview) {
  // Extract first name from reviewer name
  const firstName = review.reviewer.split(" ")[0] || review.reviewer

  return {
    id: review.id,
    name: stripHtmlTags(firstName), // Use first name only
    rating: review.rating,
    comment: stripHtmlTags(review.review),
    date: new Date(review.date_created).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    verified: review.verified,
    avatar: review.reviewer_avatar_urls?.["48"] || "/images/mehndi-service.jpg",
  }
}

function mapWooCommerceStatus(status: string): Booking["status"] {
  switch (status) {
    case "processing":
    case "on-hold":
      return "confirmed"
    case "pending":
      return "pending"
    case "completed":
      return "completed"
    case "cancelled":
    case "refunded":
    case "failed":
      return "cancelled"
    default:
      return "pending"
  }
}

export function transformWooCommerceOrderToBooking(order: WooCommerceOrder): Booking {
  const serviceName = order.line_items?.[0]?.name || "Service"

  // Look for booking details in meta_data
  const bookingDateMeta = order.meta_data?.find((meta) => meta.key === "_booking_date")
  const bookingTimeMeta = order.meta_data?.find((meta) => meta.key === "_booking_time")
  const stylistMeta = order.meta_data?.find((meta) => meta.key === "_booking_stylist")

  const bookingDate = bookingDateMeta
    ? new Date(bookingDateMeta.value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date(order.date_created!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const bookingTime = bookingTimeMeta
    ? bookingTimeMeta.value
    : new Date(order.date_created!).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const location = `${order.shipping?.address_1 || order.billing?.address_1 || ""}, ${order.shipping?.city || order.billing?.city || "N/A"}`.replace(/^, /g, "")

  return {
    id: order.id!,
    orderNumber: order.number || order.id!.toString(),
    service: serviceName,
    stylist: stylistMeta?.value || "Assigned Stylist",
    date: bookingDate,
    time: bookingTime,
    location: location || "Location not specified",
    status: mapWooCommerceStatus(order.status!),
    amount: Number(order.total || 0),
    createdAt: order.date_created!,
  }
}

// Get mock testimonials
export function getMockTestimonials() {
  return [
    {
      id: 1,
      name: "Fatima Al-Zahra",
      location: "Islamabad",
      rating: 5,
      comment: "Absolutely amazing service! The professional was very skilled and friendly. Highly recommend!",
      service: "Bridal Makeup",
      image: "/images/mehndi-service.jpg",
    },
    {
      id: 2,
      name: "Aisha Mohammed",
      location: "Lahore",
      rating: 5,
      comment: "Great experience overall. The service was professional and the results were excellent.",
      service: "Hair Styling",
      image: "/images/mehndi-service.jpg",
    },
    {
      id: 3,
      name: "Mariam Hassan",
      location: "Karachi",
      rating: 4,
      comment: "Perfect! Exactly what I was looking for. Will definitely book again.",
      service: "Facial Treatment",
      image: "/images/mehndi-service.jpg",
    },
  ]
}
