"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Footer() {
  const [showGoToTop, setShowGoToTop] = useState(false)
  const router = useRouter()

  const [collapsedSections, setCollapsedSections] = useState({
    services: true,
    company: true,
    contact: true
  })

  const toggleSection = (section: 'services' | 'company' | 'contact') => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Enhanced navigation with scroll to top
  const handleNavigation = (href: string) => {
    // First scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Small delay to ensure smooth scroll starts, then navigate
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-6">
          <div className="md:pr-4 lg:pr-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">GU</span>
              </div>
              <span className="font-bold text-xl">GlamUp</span>
            </div>
            <p className="text-gray-400 mb-6 pr-4 md:pr-0">Premium beauty services delivered to your home across Pakistan.</p>
            <div className="flex flex-wrap gap-3 max-w-[280px]">
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-110"
                style={{ minWidth: "44px", minHeight: "44px" }}
                asChild
              >
                <a href="https://www.facebook.com/GlamupBeautyservice" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-110"
                style={{ minWidth: "44px", minHeight: "44px" }}
                asChild
              >
                <a href="https://www.instagram.com/glamupservices/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-110"
                style={{ minWidth: "44px", minHeight: "44px" }}
                asChild
              >
                <a href="https://www.tiktok.com/@glamupservices" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-110"
                style={{ minWidth: "44px", minHeight: "44px" }}
                asChild
              >
                <a href="https://www.youtube.com/@GlamupServices" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 p-0 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent transition-all duration-300 hover:scale-110"
                style={{ minWidth: "44px", minHeight: "44px" }}
                asChild
              >
                <a href="https://x.com/glamupservices" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </Button>
            </div>
          </div>

          <div className={`border md:border-transparent rounded-lg md:rounded-none bg-transparent md:bg-transparent hover:bg-gray-800/30 md:hover:bg-transparent transition-all duration-200 ${
            collapsedSections.services ? 'border-gray-700/50 bg-gray-800/10 md:border-transparent md:bg-transparent' : 'border-transparent'
          }`}>
            <button
              onClick={() => toggleSection('services')}
              className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none p-3 md:p-0 rounded-lg md:rounded-none hover:bg-gray-800/50 md:hover:bg-transparent transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-white">Services</h3>
              <div className="md:hidden">
                <div className={`w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center transition-all duration-300 ${
                  !collapsedSections.services ? 'bg-pink-500 border-pink-500' : 'hover:bg-pink-500/30'
                }`}>
                  <ChevronDown 
                    className={`w-4 h-4 transition-all duration-300 ${
                      collapsedSections.services ? 'text-pink-400' : 'rotate-180 text-white'
                    }`}
                  />
                </div>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!block md:!opacity-100 md:!max-h-none ${
              collapsedSections.services ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}>
              <ul className="space-y-3 text-gray-400 p-3 md:p-0 pt-0 md:pt-3 bg-gray-800/20 md:bg-transparent rounded-b-lg md:rounded-none border-t border-gray-700/50 md:border-t-0">
                <li>
                  <button
                    onClick={() => handleNavigation("/categories/hair-styling-cut-services")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Hair Styling
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/categories/facial-services")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Facial Treatments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/categories/makeup-services")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Makeup Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/categories/mani-pedi-services")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Manicure & Pedicure
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className={`border md:border-transparent rounded-lg md:rounded-none bg-transparent md:bg-transparent hover:bg-gray-800/30 md:hover:bg-transparent transition-all duration-200 ${
            collapsedSections.company ? 'border-gray-700/50 bg-gray-800/10 md:border-transparent md:bg-transparent' : 'border-transparent'
          }`}>
            <button
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none p-3 md:p-0 rounded-lg md:rounded-none hover:bg-gray-800/50 md:hover:bg-transparent transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-white">Company</h3>
              <div className="md:hidden">
                <div className={`w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center transition-all duration-300 ${
                  !collapsedSections.company ? 'bg-pink-500 border-pink-500' : 'hover:bg-pink-500/30'
                }`}>
                  <ChevronDown 
                    className={`w-4 h-4 transition-all duration-300 ${
                      collapsedSections.company ? 'text-pink-400' : 'rotate-180 text-white'
                    }`}
                  />
                </div>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!block md:!opacity-100 md:!max-h-none ${
              collapsedSections.company ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}>
              <ul className="space-y-3 text-gray-400 p-3 md:p-0 pt-0 md:pt-3 bg-gray-800/20 md:bg-transparent rounded-b-lg md:rounded-none border-t border-gray-700/50 md:border-t-0">
                <li>
                  <button
                    onClick={() => handleNavigation("/about")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/careers")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/privacy")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/terms")}
                    className="hover:text-pink-400 transition-colors block py-2 px-3 md:py-1 md:px-0 text-left w-full hover:translate-x-1 duration-300 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className={`border md:border-transparent rounded-lg md:rounded-none bg-transparent md:bg-transparent hover:bg-gray-800/30 md:hover:bg-transparent transition-all duration-200 ${
            collapsedSections.contact ? 'border-gray-700/50 bg-gray-800/10 md:border-transparent md:bg-transparent' : 'border-transparent'
          }`}>
            <button
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none p-3 md:p-0 rounded-lg md:rounded-none hover:bg-gray-800/50 md:hover:bg-transparent transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-white">Contact</h3>
              <div className="md:hidden">
                <div className={`w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center transition-all duration-300 ${
                  !collapsedSections.contact ? 'bg-pink-500 border-pink-500' : 'hover:bg-pink-500/30'
                }`}>
                  <ChevronDown 
                    className={`w-4 h-4 transition-all duration-300 ${
                      collapsedSections.contact ? 'text-pink-400' : 'rotate-180 text-white'
                    }`}
                  />
                </div>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!block md:!opacity-100 md:!max-h-none ${
              collapsedSections.contact ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}>
              <ul className="space-y-3 text-gray-400 p-3 md:p-0 pt-0 md:pt-3 bg-gray-800/20 md:bg-transparent rounded-b-lg md:rounded-none border-t border-gray-700/50 md:border-t-0">
                <li className="hover:text-pink-400 transition-colors py-2 px-3 md:py-0 md:px-0 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent">+92 326 533 8779</li>
                <li className="hover:text-pink-400 transition-colors py-2 px-3 md:py-0 md:px-0 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent">info@glamup.pk</li>
                <li className="hover:text-pink-400 transition-colors py-2 px-3 md:py-0 md:px-0 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent">Pakistan</li>
                <li className="hover:text-pink-400 transition-colors py-2 px-3 md:py-0 md:px-0 rounded md:rounded-none hover:bg-gray-700/30 md:hover:bg-transparent">Available 7 days a week</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GlamUp. All rights reserved.</p>
        </div>
      </div>

      {/* Enhanced Go to Top Button */}
      {showGoToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg z-40 transition-all duration-300 hover:scale-110 animate-bounce"
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </footer>
  )
}
