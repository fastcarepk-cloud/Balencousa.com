"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import { getFeaturedBlogPosts, getBlogPosts } from "@/lib/data-loader"

const categories = ["All", "Bridal Beauty", "Mehndi", "Hair Care", "Skincare", "Makeup", "DIY Beauty"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const featuredPost = getFeaturedBlogPosts()[0]
  const allPosts = getBlogPosts().filter((post) => !post.featured)

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "All" ? allPosts : allPosts.filter((post) => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Beauty Tips & Trends</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover expert beauty advice, latest trends, and professional tips from our experienced stylists and
              beauty experts.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Badge className="bg-pink-500 text-white mb-4">Featured Post</Badge>
              <h2 className="text-2xl font-bold text-gray-900">Editor's Pick</h2>
            </div>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-pink-500 text-white">{featuredPost.category}</Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{featuredPost.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  category === selectedCategory
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No posts found in this category.</p>
              <Button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white"
              >
                View All Posts
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "All" ? "All Posts" : `${selectedCategory} Posts`}
                </h2>
                <p className="text-gray-600">
                  {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Grid: 3 columns on desktop, 1 column on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-pink-500 text-white text-xs">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                          <Link href={`/blog/${post.slug}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                            >
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Beauty Tips</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest beauty tips, trends, and exclusive offers delivered to your
            inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-pink-300"
            />
            <Button className="bg-white text-pink-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
