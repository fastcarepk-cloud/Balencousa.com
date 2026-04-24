import Image from "next/image"
import Link from "next/link"
import { Users, Award, Shield, Heart, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

export const metadata = {
  title: "About Us - GlamUp | Premium Beauty Services at Home",
  description:
    "Learn about GlamUp's mission to bring professional beauty services to your doorstep across Pakistan. Discover our story and values.",
}

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Professional Beauticians" },
    { number: "15+", label: "Cities Covered" },
    { number: "50,000+", label: "Services Completed" },
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Customer First",
      description: "Every decision we make is centered around providing the best experience for our customers.",
    },
    {
      icon: <Award className="w-8 h-8 text-pink-500" />,
      title: "Excellence",
      description: "We maintain the highest standards in service quality, products, and professional expertise.",
    },
    {
      icon: <Shield className="w-8 h-8 text-pink-500" />,
      title: "Trust & Safety",
      description: "Your safety and privacy are our top priorities. All our professionals are verified and trained.",
    },
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: "Empowerment",
      description: "We empower women by providing convenient access to professional beauty services at home.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-in-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  About <span className="text-pink-500">GlamUp</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We're on a mission to revolutionize the beauty industry in Pakistan by bringing professional,
                  high-quality beauty services directly to your doorstep.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 2020, GlamUp has grown to become Pakistan's most trusted at-home beauty service platform,
                  serving thousands of women across major cities.
                </p>
                <Link href="/categories">
                  <Button
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform duration-300"
                  >
                    Explore Our Services
                  </Button>
                </Link>
              </div>
              <div className="relative animate-slide-in-right">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=GlamUp+Team+Providing+Beauty+Services"
                  alt="GlamUp team providing beauty services"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Stats Section */}
      <FadeInSection delay={200}>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center animate-scale-in hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-pink-500 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Story Section */}
      <FadeInSection delay={300}>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-slide-in-left">
                  <h3 className="text-2xl font-bold text-gray-900">The Beginning</h3>
                  <p className="text-gray-600 leading-relaxed">
                    GlamUp was born from a simple observation: Pakistani women deserve access to professional beauty
                    services without the hassle of traveling to salons, waiting in queues, or compromising on quality.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our founder, Ayesha Khan, experienced firsthand the challenges women face in accessing quality
                    beauty services. With her background in the beauty industry and passion for empowering women, she
                    envisioned a platform that would bring the salon experience home.
                  </p>
                </div>
                <div className="relative animate-slide-in-right">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=GlamUp+Founder+Story"
                    alt="GlamUp founder story"
                    width={500}
                    height={400}
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
                <div className="relative order-2 md:order-1 animate-slide-in-left">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=GlamUp+Mission"
                    alt="GlamUp mission"
                    width={500}
                    height={400}
                    className="rounded-xl shadow-lg"
                  />
                </div>
                <div className="space-y-6 order-1 md:order-2 animate-slide-in-right">
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To make professional beauty services accessible, convenient, and affordable for every woman in
                    Pakistan. We believe that every woman deserves to feel beautiful and confident, regardless of her
                    location or schedule.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We're committed to supporting local beauticians by providing them with a platform to showcase their
                    skills while offering flexible working opportunities that fit their lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Values Section */}
      <FadeInSection delay={400}>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to our customers and partners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in hover:scale-105 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Contact Section */}
      <FadeInSection delay={600}>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about our services or want to learn more about GlamUp? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <MapPin className="w-8 h-8 text-pink-500 mx-auto mb-4" />,
                  title: "Location",
                  content: ["Serving across Pakistan", "Major cities covered"],
                },
                {
                  icon: <Phone className="w-8 h-8 text-pink-500 mx-auto mb-4" />,
                  title: "Phone",
                  content: ["+92 300 123 4567", "Available 7 days a week"],
                },
                {
                  icon: <Mail className="w-8 h-8 text-pink-500 mx-auto mb-4" />,
                  title: "Email",
                  content: ["info@glamup.pk", "support@glamup.pk"],
                },
              ].map((contact, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in hover:scale-105 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    {contact.icon}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                    {contact.content.map((item, itemIndex) => (
                      <p key={itemIndex} className="text-gray-600">
                        {item}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
