import { NextRequest, NextResponse } from "next/server"

const WC_BASE_URL = process.env.WC_BASE_URL || "https://store.glamup.pk/wp-json/wc/v3"
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "ck_ee6caedb32b454b2ab72b99b7cb6e99efed9af4a"
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "cs_753e19303eb3fcae13e7d5c88d9b38230ec0a677"

// Helper function to make WooCommerce API calls
async function makeWooCommerceRequest(endpoint: string, method = "GET", body?: any) {
  const url = new URL(`${WC_BASE_URL}${endpoint}`)
  url.searchParams.append("consumer_key", WC_CONSUMER_KEY)
  url.searchParams.append("consumer_secret", WC_CONSUMER_SECRET)

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body)
  }

  console.log(`Making ${method} request to:`, url.toString())

  try {
    const response = await fetch(url.toString(), options)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`WooCommerce API error: ${response.status} - ${errorText}`)
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`${method} response received:`, Array.isArray(data) ? `${data.length} items` : "Single item")
    return data
  } catch (error) {
    console.error("WooCommerce request failed:", error)
    throw error
  }
}

// GET: Check which products have reviews by a specific email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const productIds = searchParams.get("productIds")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    console.log("=== CHECKING REVIEWS ===")
    console.log("Email:", email)
    console.log("Product IDs:", productIds)

    // If specific product IDs are provided, check each one
    const reviewedProductIds = new Set<number>()
    
    if (productIds) {
      const ids = productIds.split(",").map(id => parseInt(id)).filter(id => !isNaN(id))
      console.log("Checking reviews for product IDs:", ids)
      
      for (const productId of ids) {
        try {
          const reviews = await makeWooCommerceRequest(`/products/reviews?product=${productId}&per_page=100&status=all`)
          
          if (Array.isArray(reviews)) {
            const hasReview = reviews.some((review: any) => 
              review?.reviewer_email?.toLowerCase() === email.toLowerCase()
            )
            
            if (hasReview) {
              reviewedProductIds.add(productId)
              console.log(`Found existing review for product ${productId}`)
            }
          }
        } catch (error) {
          console.warn(`Error checking reviews for product ${productId}:`, error)
        }
      }
    } else {
      // Fetch all reviews for the user
      try {
        const allReviews = await makeWooCommerceRequest(`/products/reviews?reviewer_email=${encodeURIComponent(email)}&per_page=100`)
        
        if (Array.isArray(allReviews)) {
          allReviews.forEach((review: any) => {
            if (review.product_id) {
              reviewedProductIds.add(review.product_id)
            }
          })
        }
      } catch (error) {
        console.warn("Error fetching all reviews for user:", error)
      }
    }

    const reviewed = Array.from(reviewedProductIds)
    console.log("=== REVIEW CHECK COMPLETE ===")
    console.log("Already reviewed products:", reviewed)

    return NextResponse.json({
      success: true,
      reviewed: reviewed,
      total_reviews: reviewed.length
    })

  } catch (error) {
    console.error("=== ERROR CHECKING REVIEWS ===", error)
    return NextResponse.json(
      { 
        error: "Failed to check reviews", 
        details: error instanceof Error ? error.message : "Unknown error",
        reviewed: [] // Return empty array as fallback
      }, 
      { status: 500 }
    )
  }
}

// POST: Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, reviewer, reviewer_email, review, rating } = body

    console.log("=== SUBMITTING REVIEW ===")
    console.log("Product ID:", product_id)
    console.log("Reviewer:", reviewer)
    console.log("Email:", reviewer_email)
    console.log("Rating:", rating)

    // Validate required fields
    if (!product_id || !reviewer || !reviewer_email || !review || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: product_id, reviewer, reviewer_email, review, rating" },
        { status: 400 }
      )
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(reviewer_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    try {
      const existingReviews = await makeWooCommerceRequest(
        `/products/reviews?product=${product_id}&per_page=100&status=all`
      )
      
      if (Array.isArray(existingReviews)) {
        const hasExistingReview = existingReviews.some((r: any) => 
          r?.reviewer_email?.toLowerCase() === reviewer_email.toLowerCase()
        )
        
        if (hasExistingReview) {
          console.log("User already has a review for this product")
          return NextResponse.json(
            { error: "You have already reviewed this product" },
            { status: 409 }
          )
        }
      }
    } catch (checkError) {
      console.warn("Could not check existing reviews:", checkError)
      // Continue with submission even if check fails
    }

    // Submit the review
    const reviewData = {
      product_id: parseInt(product_id),
      reviewer: reviewer.trim(),
      reviewer_email: reviewer_email.trim().toLowerCase(),
      review: review.trim(),
      rating: parseInt(rating),
      status: "approved" // Auto-approve reviews, or use "hold" for manual approval
    }

    console.log("Submitting review data:", reviewData)

    const result = await makeWooCommerceRequest("/products/reviews", "POST", reviewData)
    
    console.log("=== REVIEW SUBMITTED SUCCESSFULLY ===")
    console.log("Review ID:", result.id)
    console.log("Status:", result.status)

    return NextResponse.json({
      success: true,
      review_id: result.id,
      message: "Review submitted successfully",
      pending: result.status === "hold"
    })

  } catch (error) {
    console.error("=== ERROR SUBMITTING REVIEW ===", error)
    
    // Handle specific WooCommerce errors
    if (error instanceof Error) {
      if (error.message.includes("409")) {
        return NextResponse.json(
          { error: "You have already reviewed this product" },
          { status: 409 }
        )
      }
      if (error.message.includes("400")) {
        return NextResponse.json(
          { error: "Invalid review data provided" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: "Failed to submit review", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
