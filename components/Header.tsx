"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, User, MessageCircle, Search, LogOut, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AuthDialog from "./AuthDialog"
import SearchSuggestions from "./SearchSuggestions"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  const { user, logout, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const openWhatsApp = () => {
    const phoneNumber = "+923001234567"
    const message = "Hi! I'd like to book an appointment at GlamUp salon."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      setIsMobileSearchOpen(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(value.trim().length >= 2)
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true)
    }
  }

  const closeSuggestions = () => {
    setShowSuggestions(false)
  }

  const handleProductClick = () => {
    setShowSuggestions(false)
    setIsMobileSearchOpen(false)
    setSearchQuery("")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <Image src="/images/glamup.png" alt="GlamUp Logo" fill className="object-contain" priority />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                Glam<span className="text-pink-600">Up</span>
              </span>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-sm mx-6 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </form>
              <SearchSuggestions
                query={searchQuery}
                isVisible={showSuggestions}
                onClose={closeSuggestions}
                onProductClick={handleProductClick}
              />
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium">
                Home
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-pink-600 font-medium">
                Services
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-pink-600 font-medium">
                Blog
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-pink-600 font-medium">
                About
              </Link>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="ml-8">
                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-gray-700 hover:text-pink-600"
                    >
                      <User className="w-4 h-4" />
                      <span>Hi, {user.firstName || user.name?.split(" ")[0] || ""}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="lg:hidden pb-4 relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    className="pl-10 pr-4 py-2 w-full"
                    autoFocus
                  />
                </div>
              </form>
              <SearchSuggestions
                query={searchQuery}
                isVisible={showSuggestions}
                onClose={closeSuggestions}
                onProductClick={handleProductClick}
              />
            </div>
          )}
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-700 hover:text-pink-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="block text-gray-700 hover:text-pink-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/blog"
                className="block text-gray-700 hover:text-pink-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-pink-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Button
                  onClick={() => {
                    openWhatsApp()
                    setIsMenuOpen(false)
                  }}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
                {isLoading ? (
                  <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                ) : isAuthenticated && user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Hi, {user.firstName || user.name?.split(" ")[0] || ""}</p>
                    <Link
                      href="/account"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md border"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2 inline" />
                      My Account
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setIsAuthDialogOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <User className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  )
}
