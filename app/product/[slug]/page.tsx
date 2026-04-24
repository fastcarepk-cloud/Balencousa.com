import { notFound } from "next/navigation"
import {
  fetchProductBySlug,
  fetchProductReviews,
  fetchWooCommerceProducts,
  transformWooCommerceProduct,
  transformWooCommerceReview,
  fetchCategoryBySlug,
} from "@/lib/woocommerce-api"
import ProductPageClient from "./ProductPageClient"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params

  try {
    // Fetch product data
    const wooProduct = await fetchProductBySlug(slug)

    if (!wooProduct) {
      notFound()
    }

    // Transform product data
    const product = transformWooCommerceProduct(wooProduct)

    // Fetch reviews for this product
    const wooReviews = await fetchProductReviews(wooProduct.id)
    const reviews = wooReviews.map(transformWooCommerceReview)

    // Fetch category information
    let category = null
    if (wooProduct.categories && wooProduct.categories.length > 0) {
      category = await fetchCategoryBySlug(wooProduct.categories[0].slug)
    }

    // Fetch all products to find related ones
    const allProducts = await fetchWooCommerceProducts()

    // Filter related products (same category, excluding current product)
    const relatedProducts = allProducts
      .filter(
        (p) =>
          p.id !== wooProduct.id &&
          p.categories.some((cat) => wooProduct.categories.some((prodCat) => prodCat.id === cat.id)),
      )
      .slice(0, 6) // Limit to 6 related products
      .map(transformWooCommerceProduct)

    // Get most viewed products (mock data for now, can be enhanced with actual view tracking)
    const mostViewedProducts = allProducts
      .filter((p) => p.id !== wooProduct.id)
      .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
      .slice(0, 6)
      .map(transformWooCommerceProduct)

    return (
      <ProductPageClient
        product={product}
        reviews={reviews}
        category={category}
        relatedProducts={relatedProducts}
        mostViewedProducts={mostViewedProducts}
      />
    )
  } catch (error) {
    console.error("Error loading product:", error)
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    // This would ideally fetch all product slugs from WooCommerce
    // For now, return empty array to generate pages on-demand
    return []
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
