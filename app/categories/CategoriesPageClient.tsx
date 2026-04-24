"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

interface CategoriesPageClientProps {
  categories: any[]
}

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const filteredCategories = categories
    .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "order":
          return a.order - b.order
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-12 md:py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/beauty-banner.jpg"
            alt="Beauty Services Background"
            fill
            className="object-cover"
            priority
          />
          {/* Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/85 to-purple-600/85"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Beauty Service Categories</h1>
              <p className="text-lg md:text-xl text-pink-100 mb-6 max-w-3xl mx-auto">
                Explore our comprehensive range of professional beauty and wellness services
              </p>
              <div className="text-pink-100">
                <span className="text-2xl font-bold">{categories.length}</span> categories available
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="hidden md:block container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Categories</span>
        </div>
      </div>

      {/* Search and Filter */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="order">Sort by Order</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">{filteredCategories.length} categories found</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredCategories.map((category, index) => (
                <FadeInSection key={category.id} delay={index * 100}>
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            width={400}
                            height={250}
                            className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          {category.featured && (
                            <Badge className="absolute top-3 right-3 bg-pink-500 text-white">Featured</Badge>
                          )}
                        </div>
                        <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3">{category.description}</p>
                          <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
                            <span className="text-pink-500 font-medium">Explore Services</span>
                            <span className="text-pink-500 group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No categories found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
