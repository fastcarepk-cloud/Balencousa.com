import { Suspense } from "react"
import { fetchWooCommerceCategories, transformWooCommerceCategory } from "@/lib/woocommerce-api"
import CategoriesPageClient from "@/app/categories/CategoriesPageClient"
import LoadingSpinner from "@/components/LoadingSpinner"

export const revalidate = 86400 // Revalidate every 24 hours

export default async function CategoriesPage() {
try {
  // Fetch categories from WooCommerce API
  const wooCategories = await fetchWooCommerceCategories()

  // Transform WooCommerce data to match existing structure
  const categories = wooCategories.map(transformWooCommerceCategory)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoriesPageClient categories={categories} />
    </Suspense>
  )
} catch (error) {
  console.error("Error loading categories page:", error)

  // Fallback to empty array if API fails
  return <CategoriesPageClient categories={[]} />
}
}
