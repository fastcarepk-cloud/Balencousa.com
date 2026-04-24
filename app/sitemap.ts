import type { MetadataRoute } from "next"
import { getAllLocationServicePaths } from "@/lib/location-services"
import { getCategories, getBlogPosts, getAllServices } from "@/lib/data-loader"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://glamup.pk"

  // Get all dynamic service paths (location-based services)
  const servicePaths = await getAllLocationServicePaths()

  // Get actual categories from data
  const categories = getCategories()

  // Get actual blog posts from data
  const blogPosts = getBlogPosts()

  // Get all individual services for /product/[slug] pages
  const allServices = getAllServices()

  // Static pages that actually exist
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  // Category pages that actually exist (from your data files)
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Individual service/product pages (/product/[slug])
  const productPages = allServices.map((service) => ({
    url: `${baseUrl}/product/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.64,
  }))

  // Dynamic location-based service pages (/services/[...slug])
  const locationServicePages = servicePaths.map((path) => ({
    url: `${baseUrl}/services/${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Blog posts that actually exist (from your data files)
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.64 : 0.51,
  }))

  return [...staticPages, ...categoryPages, ...productPages, ...locationServicePages, ...blogPages]
}
