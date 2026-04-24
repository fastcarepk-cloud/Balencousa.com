import { notFound } from "next/navigation"
import CategoryPageClient from "./CategoryPageClient"
import {
  fetchWooCommerceCategories,
  fetchCategoryBySlug,
  fetchProductsByCategory,
  transformWooCommerceCategory,
  transformWooCommerceProduct,
} from "@/lib/woocommerce-api"

export const revalidate = 86400 // Revalidate every 24 hours

export async function generateStaticParams() {
  try {
    const categories = await fetchWooCommerceCategories()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for categories:", error)
    return []
  }
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const category = await fetchCategoryBySlug(params.slug)

    if (!category) {
      notFound()
    }

    const products = await fetchProductsByCategory(category.id)
    const transformedCategory = transformWooCommerceCategory(category)
    const transformedProducts = products.map(transformWooCommerceProduct)

    return <CategoryPageClient category={transformedCategory} products={transformedProducts} />
  } catch (error) {
    console.error("Error loading category page:", error)
    notFound()
  }
}
