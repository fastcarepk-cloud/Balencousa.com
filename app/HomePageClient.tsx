"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Download, Smartphone, Users, Award, Star, Shield, MapPin, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"
import FeaturedServicesSlider from "@/components/FeaturedServicesSlider"
import HeroImageSlider from "@/components/HeroImageSlider"

interface HomePageClientProps {
  categories: any[]
  featuredProducts: any[]
}

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="

export default function HomePageClient({ categories = [], featuredProducts = [] }: HomePageClientProps) {
  const handleDownloadApp = () => {
    alert("Mobile app coming soon! Stay tuned for updates.")
  }

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Customers" },
    { icon: Award, value: "100+", label: "Expert Beauticians" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Shield, value: "1000+", label: "Services Completed" },
  ]

  const features = [
    {
      icon: MapPin,
      title: "Convenience at Home",
      description: "Enjoy professional salon services in the comfort and safety of your own home.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "Our beauticians are certified, experienced, and undergo rigorous background checks.",
    },
    {
      icon: Award,
      title: "Premium Products",
      description: "We use only high-quality, hygienic, and branded products for all our services.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book appointments that fit your schedule, with services available 7 days a week.",
    },
  ]

  const testimonials = [
    {
      name: "Ayesha K.",
      location: "Lahore",
      comment: "The best home salon experience I've ever had! The stylist was so professional and my hair has never looked better. Highly recommend GlamUp!",
      rating: 5,
    },
    {
      name: "Fatima S.",
      location: "Karachi",
      comment: "Booking was so easy and the beautician arrived right on time. The facial was incredibly relaxing and my skin is glowing. Will definitely book again.",
      rating: 5,
    },
    {
      name: "Sana A.",
      location: "Islamabad",
      comment: "I was hesitant to try a home service for my bridal makeup, but GlamUp exceeded all my expectations. They made me feel like a queen on my special day.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-8 pb-12 md:pt-8 md:pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <FadeInSection>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Premium Beauty Services
                  <span className="block text-pink-500">Exclusively For Women</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Book professional makeup artists, hair stylists, and beauty experts. Get pampered in the comfort of
                  your home with premium quality services.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                    asChild
                  >
                    <Link href="/categories">
                      Book a Service
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDownloadApp}
                    className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-full bg-transparent group"
                  >
                    <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                    Download App
                    <Smartphone className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <HeroImageSlider />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <div className="text-center">
                  <stat.icon className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Slider Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Popular Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular beauty treatments, loved by thousands of satisfied customers.
              </p>
            </div>
          </FadeInSection>
          <FeaturedServicesSlider services={featuredProducts} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From bridal makeup to relaxing spa treatments, we offer a complete range of beauty services.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <FadeInSection key={category.id} delay={index * 100}>
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="relative h-40">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={400}>
            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-pink-500 text-pink-600 hover:bg-pink-50 px-8 rounded-full bg-transparent"
              >
                <Link href="/categories">
                  View All Categories
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Why Choose Glamup Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose GlamUp?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We are committed to providing a safe, convenient, and high-quality beauty experience.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <Card className="text-center p-6 h-full border-0 shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Customers Say Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real stories from our valued clients across Pakistan.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <Card className="h-full bg-gray-50 border-0 shadow-sm">
                  <CardContent className="p-6 flex flex-col">
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 italic mb-4 flex-grow">"{testimonial.comment}"</blockquote>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="relative rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12 text-white overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full"></div>
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a GlamUp Partner</h2>
                  <p className="text-lg text-pink-100 mb-6">
                    Are you a talented beautician? Join our team of certified professionals and grow your career with
                    us. Enjoy flexible timings and a wide customer base.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold"
                  >
                    <Link href="/careers">Join Our Team</Link>
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Image
                    src="/images/hair-styling.png"
                    alt="GlamUp Partner"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Look Your Best?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Book your appointment today and experience professional beauty services at your doorstep.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full"
            >
              <Link href="/categories">
                Book Your Service Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </FadeInSection>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
