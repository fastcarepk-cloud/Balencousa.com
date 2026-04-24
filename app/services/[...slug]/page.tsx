import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Star, Clock, MapPin, MessageCircle, Smartphone, Download, Users, Award, Shield, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import {
  getLocationServiceData,
  getAllLocationServicePaths,
  type LocationServiceData,
} from "@/lib/location-services"
import {
  fetchCategoryBySlug,
  fetchProductsByCategory,
  type WooCommerceProduct,
} from "@/lib/woocommerce-api"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const paths = await getAllLocationServicePaths()
  return paths.map((path) => ({
    slug: path.split("/").filter(Boolean),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join("/")
  const data = await getLocationServiceData(slugString)

  if (!data) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    }
  }

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords?.join(", "),
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://glamup.pk/services/${slugString}`,
      siteName: "GlamUp",
      images: [
        {
          url: data.image || "/placeholder.svg?height=630&width=1200",
          width: 1200,
          height: 630,
          alt: data.imageAlt || data.title,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
      images: [data.image || "/placeholder.svg?height=630&width=1200"],
    },
    alternates: {
      canonical: `https://glamup.pk/services/${slugString}`,
    },
  }
}

async function getMakeupProducts(): Promise<WooCommerceProduct[]> {
  try {
    // Resolve category by its WooCommerce slug
    const category = await fetchCategoryBySlug("makeup-services")
    if (!category?.id) return []
    const products = await fetchProductsByCategory(category.id)
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

export default async function LocationServicePage({ params }: PageProps) {
  const { slug } = await params
  const slugString = slug.join("/")
  const data = await getLocationServiceData(slugString)

  if (!data) {
    notFound()
  }

  // Attempt to load products from "makeup-services" category
  const makeupProducts = await getMakeupProducts()

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/categories" },
    { name: data.city, href: "#" },
    { name: data.area, href: "#" },
    { name: data.service, href: "#" },
  ]

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://glamup.pk"
  const pageUrl = `${siteUrl}/services/${slugString}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    description: data.metaDescription || data.intro,
    areaServed: {
      "@type": "Place",
      name: `${data.area}, ${data.city}`,
    },
    serviceType: data.service,
    provider: {
      "@type": "Organization",
      name: "GlamUp",
      url: siteUrl,
    },
    image: data.image ? `${siteUrl}${data.image}` : undefined,
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: "PKR",
      url: pageUrl,
      availability: "https://schema.org/InStock",
    },
    aggregateRating:
      data.rating && data.reviews
        ? {
            "@type": "AggregateRating",
            ratingValue: data.rating,
            reviewCount: data.reviews,
          }
        : undefined,
  }

  // Replace with your business WhatsApp number (no +)
  const whatsappNumber = "923001234567"
  const waMessage = encodeURIComponent(
    `Hi GlamUp, I want to book "${data.service}" in ${data.area}, ${data.city}.`
  )

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
              {breadcrumbs.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  {index > 0 && <span className="mx-2" aria-hidden="true">{"/"}</span>}
                  <a
                    href={item.href}
                    className={index === breadcrumbs.length - 1 ? "text-pink-600 font-medium" : "hover:text-pink-600"}
                    aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{data.title}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{data.intro}</p>

                {/* Service Details */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{data.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">{data.rating}</span>
                        <span className="text-gray-400">({data.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 mb-8">
                  <MapPin className="h-5 w-5 text-pink-600" />
                  <span className="text-gray-600">
                    Available at Residence 21 in {data.area}, {data.city}
                  </span>
                </div>

                {/* Price Display */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting Price</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-pink-600">PKR {data.price}</span>
                        {data.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">PKR {data.originalPrice}</span>
                        )}
                        {data.discount && <Badge className="bg-red-500 text-white">{data.discount}% OFF</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8" asChild>
                    <a href="/categories" aria-label="Book now - go to categories">Book Now</a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-pink-600 text-pink-600 hover:bg-pink-50 bg-transparent"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Book on WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp Booking
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-gray-100 px-8"
                    asChild
                  >
                    <a href="#download" aria-label="Download mobile app">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Download Mobile
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <figure>
                  <img
                    src={data.image || "/placeholder.svg?height=500&width=600&query=eye makeup without lashes"}
                    alt={data.imageAlt || data.title}
                    title={data.imageTitle || data.title}
                    className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                    loading="eager"
                    width={600}
                    height={500}
                  />
                  {data.imageCaption && (
                    <figcaption className="text-sm text-gray-500 mt-3">{data.imageCaption}</figcaption>
                  )}
                </figure>
                {data.discount && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-lg">
                    {data.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1,000+ Happy Clients</h3>
                <p className="text-gray-600">Trusted across {data.city}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certified Artists</h3>
                <p className="text-gray-600">Specialists in eye-focused looks</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hygienic & Safe</h3>
                <p className="text-gray-600">Sterilized tools and sanitized kits</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-pink-100 p-4 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
                <p className="text-gray-600">Smudge-resistant, long-wear formulas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {data.features && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Choose Our {data.service} in {data.area}?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {data.features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-pink-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Makeup Products Grid - renders only if products available */}
        {makeupProducts.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Popular in Makeup</h2>
                <a href="/categories" className="text-pink-600 hover:underline text-sm">
                  Browse all categories
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {makeupProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={
                            (product as any).images?.[0]?.src ||
                            "/placeholder.svg?height=200&width=300&query=makeup product"
                           || "/placeholder.svg"}
                          alt={(product as any).name}
                          title={(product as any).name}
                          width={300}
                          height={200}
                          loading="lazy"
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-pink-600">
                          {(product as any).name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs md:text-sm font-medium text-gray-900">
                              {(product as any).average_rating || "4.8"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">({(product as any).rating_count || "100"})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-base md:text-lg font-bold text-gray-900">
                              Rs {(product as any).price}
                            </span>
                            {(product as any).regular_price &&
                              (product as any).sale_price &&
                              (product as any).regular_price !== (product as any).sale_price && (
                                <span className="text-xs md:text-sm text-gray-500 line-through">
                                  Rs {(product as any).regular_price}
                                </span>
                              )}
                          </div>
                          <a
                            href={`/product/${(product as any).slug}`}
                            className="text-pink-600 text-xs md:text-sm hover:underline"
                            aria-label={`View ${(product as any).name}`}
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Process */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Book Online</h3>
                <p className="text-gray-600">Choose your service and preferred time slot</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Artist Arrives</h3>
                <p className="text-gray-600">Certified makeup artist comes to your location</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Enjoy Service</h3>
                <p className="text-gray-600">Relax while we create your eye look</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-pink-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Pay & Share Feedback</h3>
                <p className="text-gray-600">Secure payment and share your review</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {data.faq && data.faq.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                {data.faq.map((item, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">{item.q}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Book Your {data.service} at Residence 21?</h2>
            <p className="text-xl mb-8 opacity-90">
              Professional eye makeup at your doorstep in {data.area}, {data.city}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100 px-8" asChild>
                <a href="/categories" aria-label="Book now">Book Now</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pink-600 px-8 bg-transparent"
                asChild
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp booking"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Booking
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section id="download" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Get GlamUp on Your Phone</h2>
              <p className="text-gray-600 mb-8">Book faster, track appointments, and receive exclusive offers with our mobile app.</p>
              <div className="flex items-center justify-center gap-4">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white" asChild>
                  <a href="#" aria-label="Download on the App Store">
                    <Download className="w-4 h-4 mr-2" />
                    App Store
                  </a>
                </Button>
                <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50" asChild>
                  <a href="#" aria-label="Get it on Google Play">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Google Play
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
