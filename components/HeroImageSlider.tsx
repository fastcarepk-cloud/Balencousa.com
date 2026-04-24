"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const heroImages = [
  {
    src: "/images/bridal-makeup.jpg",
    alt: "Bridal Makeup Services",
    title: "Bridal Makeup",
    href: "/categories/makeup",
  },
  {
    src: "/images/mehndi-art.jpg",
    alt: "Mehndi Services",
    title: "Mehndi Art",
    href: "/categories/mehndi-services",
  },
  {
    src: "/images/hair-styling.pjp",
    alt: "Hair Styling Services",
    title: "Hair Styling",
    href: "/categories/hair-styling-cut",
  },
  {
    src: "/images/facial-treatment.jpg",
    alt: "Facial Treatment Services",
    title: "Facial Treatment",
    href: "/categories/facial-services",
  },
  {
    src: "/images/spa-massage-hb.jpg",
    alt: "Spa and Massage Services",
    title: "Spa & Massage",
    href: "/categories/massage-services",
  },
]

export default function HeroImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setCurrentSlide(index)
  }

  return (
    <Link href={heroImages[currentSlide].href} passHref>
      <div
        className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        style={{ cursor: "pointer" }}
      >
        {/* Image Container with Fade Transition */}
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Image Title with Fade Animation */}
              <div
                className={`absolute bottom-4 left-4 text-white transition-all duration-1000 ${
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h3 className="text-lg md:text-xl font-semibold drop-shadow-lg">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          size="sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          size="sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Dots Indicator with Fade Animation */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(e, index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                index === currentSlide ? "bg-white scale-110 shadow-lg" : "bg-white/50 hover:bg-white/75 hover:scale-105"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter with Fade Animation */}
        <div className="absolute top-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-500">
          {currentSlide + 1} / {heroImages.length}
        </div>
      </div>
    </Link>
  )
}
