"use client"

import Image from "next/image"
import { MapPin, Users, TrendingUp, Heart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import FadeInSection from "@/components/FadeInSection"

export default function CareersPageClient() {
  const scrollToOpenPositions = () => {
    const openPositionsSection = document.getElementById("open-positions")
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const jobOpenings = [
    {
      title: "Senior Beauty Specialist",
      department: "Operations",
      location: "Lahore, Karachi, Islamabad",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Lead beauty treatments and mentor junior specialists. Expertise in makeup, skincare, and hair styling required.",
      requirements: [
        "3+ years experience in professional beauty services",
        "Certification in beauty/cosmetology",
        "Excellent customer service skills",
        "Ability to work flexible hours",
      ],
    },
    {
      title: "Mobile Beauty Technician",
      department: "Field Operations",
      location: "Multiple Cities",
      type: "Part-time/Full-time",
      experience: "1+ years",
      description: "Provide at-home beauty services including facials, waxing, manicures, and pedicures.",
      requirements: [
        "1+ years experience in beauty services",
        "Own transportation preferred",
        "Professional appearance and attitude",
        "Flexible schedule availability",
      ],
    },
    {
      title: "Training Coordinator",
      department: "Training & Development",
      location: "Lahore",
      type: "Full-time",
      experience: "2+ years",
      description: "Develop training programs and ensure quality standards across all service providers.",
      requirements: [
        "2+ years in training or beauty education",
        "Strong communication skills",
        "Experience in curriculum development",
        "Beauty industry background preferred",
      ],
    },
    {
      title: "Customer Success Manager",
      department: "Customer Experience",
      location: "Remote/Karachi",
      type: "Full-time",
      experience: "2+ years",
      description: "Manage customer relationships and ensure exceptional service delivery experience.",
      requirements: [
        "2+ years in customer success or support",
        "Excellent communication skills in Urdu/English",
        "Problem-solving abilities",
        "Experience with CRM systems",
      ],
    },
    {
      title: "Regional Operations Manager",
      department: "Operations",
      location: "Islamabad",
      type: "Full-time",
      experience: "4+ years",
      description: "Oversee operations in assigned regions and manage team of beauty specialists.",
      requirements: [
        "4+ years in operations management",
        "Leadership and team management skills",
        "Beauty industry experience preferred",
        "Strong analytical abilities",
      ],
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Lahore/Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Develop and execute digital marketing campaigns to grow our customer base.",
      requirements: [
        "2+ years in digital marketing",
        "Social media marketing expertise",
        "Content creation skills",
        "Analytics and reporting experience",
      ],
    },
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-500" />,
      title: "Career Growth",
      description: "Clear advancement paths with regular performance reviews and promotion opportunities.",
    },
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: "Training & Development",
      description: "Continuous learning opportunities with industry experts and certification programs.",
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Work-Life Balance",
      description: "Flexible schedules and remote work options to maintain healthy work-life balance.",
    },
    {
      icon: <Award className="w-8 h-8 text-pink-500" />,
      title: "Competitive Package",
      description: "Attractive salary packages with performance bonuses and comprehensive benefits.",
    },
  ]

  const handleApply = (jobTitle: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in applying for the ${jobTitle} position at GlamUp. Please provide more details about the application process.`,
    )
    const phoneNumber = "923001234567"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

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
                  Join the <span className="text-pink-500">GlamUp</span> Team
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Be part of Pakistan's leading beauty service platform and help us revolutionize how women access
                  professional beauty treatments.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We're looking for passionate individuals who share our vision of empowering women through accessible,
                  high-quality beauty services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform duration-300"
                    onClick={scrollToOpenPositions}
                  >
                    View Open Positions
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-4 rounded-full text-lg bg-transparent hover:scale-105 transition-transform duration-300"
                    onClick={() => handleApply("General Application")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
              <div className="relative animate-slide-in-right">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=GlamUp+Team+Working+Together"
                  alt="GlamUp team working together"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Join Us Section */}
      <FadeInSection delay={200}>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Join GlamUp?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We offer more than just a job - we provide a platform for growth, learning, and making a real impact.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow animate-fade-in hover:scale-105 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Open Positions Section */}
      <FadeInSection delay={300}>
        <section id="open-positions" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Open Positions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our current job openings and find the perfect role to advance your career.
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {jobOpenings.map((job, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow animate-slide-up hover:scale-[1.02] duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-pink-500 border-pink-500">
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="text-blue-500 border-blue-500">
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            {job.experience}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        className="bg-pink-500 hover:bg-pink-600 text-white mt-4 md:mt-0 hover:scale-105 transition-transform duration-300"
                        onClick={() => handleApply(job.title)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-sm">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Application Process Section */}
      <FadeInSection delay={400}>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Application Process</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our hiring process is designed to be transparent and efficient while ensuring the best fit for both
                parties.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Apply",
                  description: "Submit your application through WhatsApp or email with your resume and cover letter.",
                },
                {
                  step: "2",
                  title: "Review",
                  description:
                    "Our HR team reviews your application and contacts qualified candidates within 48 hours.",
                },
                {
                  step: "3",
                  title: "Interview",
                  description:
                    "Initial phone/video interview followed by in-person or practical assessment if required.",
                },
                {
                  step: "4",
                  title: "Welcome",
                  description: "Successful candidates receive an offer and join our comprehensive onboarding program.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center animate-scale-in hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-pink-200 transition-colors">
                    <span className="text-2xl font-bold text-pink-500">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection delay={500}>
        <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-up">
              Ready to Start Your Journey?
            </h2>
            <p
              className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              Join our team and be part of transforming the beauty industry in Pakistan. We're excited to hear from you!
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                size="lg"
                className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300"
                onClick={() => handleApply("General Application")}
              >
                Apply Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pink-500 px-8 py-4 rounded-full text-lg bg-transparent hover:scale-105 transition-transform duration-300"
                onClick={() => window.open("mailto:careers@glamup.pk")}
              >
                Email Us: careers@glamup.pk
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
