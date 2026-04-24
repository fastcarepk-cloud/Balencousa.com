"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

interface CategoriesPageClientProps {
  categories: any[]
}

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-lg md:text-xl text-pink-100 mb-6 max-w-3xl mx-auto">
                Choose from our comprehensive range of professional beauty services, all delivered to your doorstep
              </p>
              <div className="flex items-center justify-center space-x-2 text-pink-100">
                <MapPin className="w-5 h-5" />
                <span>Available in Karachi, Lahore, Islamabad & Rawalpindi</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Categories</span>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.map((category, index) => (
                <FadeInSection key={category.id} delay={index * 100}>
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg?height=250&width=400"}
                            alt={category.name}
                            width={400}
                            height={250}
                            className="w-full h-56 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <span>{category.count} services</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>4.8+</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {category.description ||
                              `Professional ${category.name.toLowerCase()} services at your doorstep`}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-pink-500 font-semibold group-hover:text-pink-600 transition-colors">
                              Explore Services
                            </span>
                            <ArrowRight className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
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
              <p className="text-lg text-gray-600">No categories available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
