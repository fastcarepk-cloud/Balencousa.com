import { Suspense } from "react"
import HomePageClient from "./HomePageClient"
import {
  fetchWooCommerceCategories,
  fetchWooCommerceProducts,
  transformWooCommerceCategory,
  transformWooCommerceProduct,
} from "@/lib/woocommerce-api"
import LoadingSpinner from "@/components/LoadingSpinner"

export const revalidate = 86400 // Revalidate every 24 hours

export default async function HomePage() {
  try {
    // Fetch data from WooCommerce API
    const [wooCategories, wooProducts] = await Promise.all([fetchWooCommerceCategories(), fetchWooCommerceProducts()])

    // Transform WooCommerce data to match existing structure
    const categories = wooCategories.map(transformWooCommerceCategory)
    const allProducts = wooProducts.map(transformWooCommerceProduct)

    // Get featured products (first 8 products or those marked as featured)
    const featuredProducts =
      allProducts.filter((product) => product.featured).slice(0, 8).length > 0
        ? allProducts.filter((product) => product.featured).slice(0, 8)
        : allProducts.slice(0, 8)

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <HomePageClient categories={categories} featuredProducts={featuredProducts} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error loading home page:", error)

    // Fallback to empty arrays if API fails
    return <HomePageClient categories={[]} featuredProducts={[]} />
  }
}
