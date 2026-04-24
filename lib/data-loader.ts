// Data loading utilities for separated data files
import categoriesData from "@/data/categories/categories.json"
import makeupServices from "@/data/services/makeup.json"
import hairTreatmentServices from "@/data/services/hair-treatment.json"
import testimonialsData from "@/data/testimonials/testimonials.json"
import blogPostsData from "@/data/blog/blog-posts.json"
import waxingServices from "@/data/services/waxing-services.json"
import massageServices from "@/data/services/massage-services.json"
import maniPediServices from "@/data/services/mani-pedi.json"
import facialServices from "@/data/services/facial-services.json"
import mehndiServices from "@/data/services/mehndi-services.json"
import hairStylingServices from "@/data/services/hair-styling-cut.json"

// Types
export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
  featured: boolean
  order: number
}

export interface Service {
  id: string
  name: string
  slug: string
  image: string
  shortDescription: string
  longDescription: string
  price: number
  originalPrice: number
  discount: number
  duration: string
  rating: number
  reviewCount: number
  featured: boolean
  tags: string[]
  availability: string
}

export interface ServiceCategory {
  categoryId: string
  services: Service[]
}

export interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  comment: string
  service: string
  serviceId: string
  image: string
  date: string
  verified: boolean
  featured: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  authorImage: string
  authorBio: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  views: number
  likes: number
}

// Service data mapping
const serviceDataMap: { [key: string]: ServiceCategory } = {
  makeup: makeupServices,
  "hair-treatment": hairTreatmentServices,
  "waxing-services": waxingServices,
  "massage-services": massageServices,
  "mani-pedi": maniPediServices,
  "facial-services": facialServices,
  "mehndi-services": mehndiServices,
  "hair-styling-cut": hairStylingServices,
}

// Categories
export function getCategories(): Category[] {
  return categoriesData.categories
}

export function getCategoryBySlug(slug: string): Category | null {
  return categoriesData.categories.find((cat) => cat.slug === slug) || null
}

export function getFeaturedCategories(): Category[] {
  return categoriesData.categories.filter((cat) => cat.featured).sort((a, b) => a.order - b.order)
}

// Services
export function getServicesByCategory(categorySlug: string): Service[] {
  const serviceData = serviceDataMap[categorySlug]
  return serviceData ? serviceData.services : []
}

export function getAllServices(): Service[] {
  const allServices: Service[] = []
  Object.values(serviceDataMap).forEach((categoryData) => {
    allServices.push(...categoryData.services)
  })
  return allServices
}

export function getServiceBySlug(slug: string): { service: Service; category: Category } | null {
  for (const [categorySlug, serviceData] of Object.entries(serviceDataMap)) {
    const service = serviceData.services.find((s) => s.slug === slug)
    if (service) {
      const category = getCategoryBySlug(categorySlug)
      if (category) {
        return { service, category }
      }
    }
  }
  return null
}

export function getFeaturedServices(): Service[] {
  return getAllServices()
    .filter((service) => service.featured)
    .sort((a, b) => b.rating - a.rating)
}

export function getServicesByTag(tag: string): Service[] {
  return getAllServices().filter((service) => service.tags.includes(tag))
}

// Combined data for backward compatibility
export function getCategoriesWithServices() {
  return categoriesData.categories.map((category) => ({
    ...category,
    services: getServicesByCategory(category.slug),
  }))
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  return testimonialsData.testimonials
}

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonialsData.testimonials.filter((t) => t.featured)
}

export function getTestimonialsByService(serviceId: string): Testimonial[] {
  return testimonialsData.testimonials.filter((t) => t.serviceId === serviceId)
}

// Blog Posts
export function getBlogPosts(): BlogPost[] {
  return blogPostsData.posts.filter((post) => post.published)
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return blogPostsData.posts.find((post) => post.slug === slug && post.published) || null
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPostsData.posts
    .filter((post) => post.featured && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPostsData.posts
    .filter((post) => post.category === category && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPostsData.posts
    .filter((post) => post.tags.includes(tag) && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Search functionality
export function searchServices(query: string): Service[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllServices().filter(
    (service) =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      service.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase()
  return getBlogPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
