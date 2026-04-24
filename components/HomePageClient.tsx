"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Star, MapPin, Clock, Shield, Award, Users, ArrowRight, CheckCircle, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"
import FeaturedServicesSlider from "@/components/FeaturedServicesSlider"

interface HomePageClientProps {
  categories: any[]
  featuredProducts: any[]
  allProducts: any[]
}

export default function HomePageClient({ categories, featuredProducts, allProducts }: HomePageClientProps) {
  const [selectedCity, setSelectedCity] = useState("Karachi")

  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"]

  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Award, label: "Expert Beauticians", value: "500+" },
    { icon: Star, label: "Average Rating", value: "4.9" },
    { icon: Shield, label: "Services Completed", value: "100,000+" },
  ]

  const features = [
    {
      icon: MapPin,
      title: "Home Service",
      description: "Professional beauticians come to your doorstep",
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Book appointments at your convenient time",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All beauticians are certified and background verified",
    },
    {
      icon: Award,
      title: "Premium Products",
      description: "We use only high-quality, branded beauty products",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Fatima Al-Zahra",
      location: "Islamabad",
      rating: 5,
      comment: "Absolutely amazing service! The professional was very skilled and friendly. Highly recommend!",
      service: "Bridal Makeup",
      image: "/images/mehndi-service.jpg",
    },
    {
      id: 2,
      name: "Aisha Mohammed",
      location: "Lahore",
      rating: 5,
      comment: "Great experience overall. The service was professional and the results were excellent.",
      service: "Hair Styling",
      image: "/images/mehndi-service.jpg",
    },
    {
      id: 3,
      name: "Mariam Hassan",
      location: "Karachi",
      rating: 4,
      comment: "Perfect! Exactly what I was looking for. Will definitely book again.",
      service: "Facial Treatment",
      image: "/images/mehndi-service.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <FadeInSection>
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Premium Beauty Services at Your
                  <span className="text-yellow-300"> Doorstep</span>
                </h1>
                <p className="text-lg md:text-xl text-pink-100 mb-8 leading-relaxed">
                  Professional makeup artists, hair stylists, and beauty experts available 24/7. Book now and get
                  pampered at home with premium quality services.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-full"
                    asChild
                  >
                    <Link href="/categories">
                      Book Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Call Now
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-pink-100">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Available in 4 Cities</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>4.9 Rating</span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div className="relative">
                <Image
                  src="/images/beauty-banner.jpg"
                  alt="Professional Beauty Services"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">50,000+ Happy Customers</p>
                      <p className="text-sm text-gray-600">Trusted across Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our wide range of professional beauty services, all available at your doorstep
              </p>
            </div>
          </FadeInSection>

          {featuredProducts.length > 0 ? (
            <FeaturedServicesSlider services={featuredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured services...</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Service Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our comprehensive range of beauty and wellness services
              </p>
            </div>
          </FadeInSection>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.slice(0, 6).map((category, index) => (
                <FadeInSection key={category.id} delay={index * 100}>
                  <Link href={`/categories/${category.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg?height=200&width=300"}
                            alt={category.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                            <p className="text-sm text-pink-200">{category.count} services</p>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {category.description || `Professional ${category.name.toLowerCase()} services`}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-pink-500 font-semibold group-hover:text-pink-600 transition-colors">
                              View Services
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
              <p className="text-gray-600">Loading categories...</p>
            </div>
          )}

          <FadeInSection delay={600}>
            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full">
                <Link href="/categories">
                  View All Categories
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Glamup.pk?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing the best beauty services with convenience and quality
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Read reviews from thousands of satisfied customers across Pakistan
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInSection key={testimonial.id} delay={index * 100}>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600 font-semibold">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {testimonial.service}
                      </Badge>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Pampered?</h2>
              <p className="text-lg md:text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
                Book your appointment now and experience premium beauty services at your doorstep
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-full"
                  asChild
                >
                  <Link href="/categories">
                    Book Service Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Us
                </Button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
