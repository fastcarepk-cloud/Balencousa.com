import { Suspense } from "react"
import SearchPageClient from "./SearchPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Services - GlamUp Beauty Salon",
  description: "Search for beauty and wellness services at GlamUp. Find the perfect treatment for you.",
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageClient />
    </Suspense>
  )
}
