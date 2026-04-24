export interface LocationServiceData {
  title: string
  metaTitle: string
  metaDescription: string
  keywords?: string[]
  intro: string
  price: number
  originalPrice?: number
  discount?: number
  duration: string
  rating: number
  reviews: number
  city: string
  area: string
  service: string
  image?: string
  imageAlt?: string
  imageTitle?: string
  imageCaption?: string
  productCategorySlug?: string
  features?: Array<{
    title: string
    description: string
  }>
  faq?: Array<{
    q: string
    a: string
  }>
}

/**
 * Normalize slug variants from URL to data folder naming.
 * - ".../dha-phase1/..." -> ".../dha-phase-1/..."
 */
function normalizeSlugForData(slug: string): string {
  const decoded = decodeURIComponent(slug)
  return decoded.replace(/\/dha-phase(\d+)\//i, (_m, num) => `/dha-phase-${num}/`)
}

import { servicesIndex } from "@/data/services-index"

/**
 * Resolve service data by slug using the prebuilt index.
 * Example URL: "islamabad/dha-phase1/hair-dye-and-wash-residence-21"
 * Index key:    "islamabad/dha-phase-1/hair-dye-and-wash-residence-21"
 */
export async function getLocationServiceData(slug: string): Promise<LocationServiceData | null> {
  const normalized = normalizeSlugForData(slug)
  return servicesIndex[normalized] ?? null
}

/**
 * Dynamic rendering is fine; if you ever need SSG, return keys here.
 */
export async function getAllLocationServicePaths(): Promise<string[]> {
  return []
}
