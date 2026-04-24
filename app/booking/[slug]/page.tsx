"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, Clock, X, UserCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/Header"
import BookingLoader from "@/components/BookingLoader"
import SearchableAreaDropdown from "@/components/SearchableAreaDropdown"
import DateTimeSelector from "@/components/DateTimeSelector"
import { transformWooCommerceProduct, type WooCommerceProduct } from "@/lib/woocommerce-api"
import { useAuth } from "@/lib/auth-context"
import AuthDialog from "@/components/AuthDialog"

interface BookingPageProps {
  params: {
    slug: string
  }
}

interface AddOn {
  id: string
  name: string
  description: string
  price: string
  sale_price?: string
  discounted: boolean
  image?: string
}

interface TransformedProduct {
  id: number
  name: string
  slug: string
  image: string
  price: number
  duration: string
  categories: Array<{ id: number; name: string; slug: string }>
}

interface BookingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  state: string
  area: string
  customArea: string
  address: string
  selectedDate: string
  selectedTime: string
  additionalDetails: string
  agreedToTerms: boolean
}

const cities = [
  { name: "Rawalpindi", state: "Punjab" },
  { name: "Islamabad", state: "Islamabad Capital Territory" },
  { name: "Lahore", state: "Punjab" },
  { name: "Karachi", state: "Sindh" },
]

const areasByCity: { [key: string]: string[] } = {
  Rawalpindi: [
    "Saddar",
    "Commercial Market",
    "Committee Chowk",
    "Murree Road",
    "Satellite Town",
    "Westridge",
    "Chaklala",
    "Gulzar-e-Quaid",
    "PWD",
    "Askari",
    "Bahria Town",
    "DHA Phase 1",
    "DHA Phase 2",
    "Gulraiz",
    "Other",
  ],
  Islamabad: [
    "F-6",
    "F-7",
    "F-8",
    "F-10",
    "F-11",
    "G-9",
    "G-10",
    "G-11",
    "G-13",
    "Blue Area",
    "DHA Phase 1",
    "DHA Phase 2",
    "Bahria Town",
    "E-11",
    "I-8",
    "I-9",
    "I-10",
    "Margalla Hills",
    "Other",
  ],
  Lahore: [
    "DHA Phase 1",
    "DHA Phase 2",
    "DHA Phase 3",
    "DHA Phase 4",
    "DHA Phase 5",
    "Gulberg",
    "Model Town",
    "Johar Town",
    "Cantt",
    "Mall Road",
    "Liberty Market",
    "MM Alam Road",
    "Fortress Stadium",
    "Valencia Town",
    "Bahria Town",
    "Lake City",
    "Wapda Town",
    "Other",
  ],
  Karachi: [
    "DHA Phase 1",
    "DHA Phase 2",
    "DHA Phase 4",
    "DHA Phase 5",
    "DHA Phase 6",
    "Clifton",
    "Gulshan-e-Iqbal",
    "North Nazimabad",
    "Saddar",
    "Korangi",
    "Malir",
    "Gulistan-e-Johar",
    "PECHS",
    "Bahadurabad",
    "Tariq Road",
    "Nazimabad",
    "Federal B Area",
    "Other",
  ],
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<TransformedProduct | null>(null)
  const [wooProduct, setWooProduct] = useState<WooCommerceProduct | null>(null)
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    area: "",
    customArea: "",
    address: "",
    selectedDate: "",
    selectedTime: "",
    additionalDetails: "",
    agreedToTerms: false,
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      const userCity = user.city || ""
      const selectedCityData = cities.find((c) => c.name === userCity)

      setBookingForm((prevForm) => ({
        ...prevForm,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: userCity,
        state: selectedCityData?.state || "",
        address: user.address || "",
        area: prevForm.area,
      }))
    }
  }, [user, isAuthenticated])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Loading booking data for slug:", params.slug)

        const fetchProduct = async () => {
          const response = await fetch(`/api/woocommerce/product-by-slug/${params.slug}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch service information.' }));
            if (response.status === 404) {
              throw new Error(`Service with slug "${params.slug}" not found.`);
            }
            throw new Error(errorData.error || 'Failed to fetch service information.');
          }
          return response.json();
        };

        const [wooProductData] = await Promise.all([
          fetchProduct(),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ])

        if (!wooProductData) {
          setError(`Service with slug "${params.slug}" not found.`)
          return
        }

        console.log("Fetched WooCommerce product:", wooProductData)
        setWooProduct(wooProductData)
        setProduct(transformWooCommerceProduct(wooProductData))

        const response = await fetch(`/api/woocommerce/product-addons/${wooProductData.id}`)
        if (!response.ok) {
          console.warn("Failed to fetch addons, continuing without them")
          setAddOns([])
        } else {
          const addonsData = await response.json()
          if (addonsData.addons) {
            const transformedAddons: AddOn[] = addonsData.addons.map((addon: any) => ({
              id: addon.name,
              name: addon.name,
              description: addon.description || `${addon.name} - Premium add-on service`,
              price: addon.price,
              sale_price: addon.sale_price,
              discounted: addon.discounted || false,
              image: addon.image,
            }))
            setAddOns(transformedAddons)
          }
        }
      } catch (err: any) {
        console.error("Error loading booking data:", err)
        setError(err.message || "Failed to load service information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.slug])

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const calculateTotal = () => {
    if (!product) return 0
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      if (addOn) {
        const finalPrice =
          addOn.discounted && addOn.sale_price ? Number.parseFloat(addOn.sale_price) : Number.parseFloat(addOn.price)
        return total + finalPrice
      }
      return total
    }, 0)
    return product.price + addOnTotal
  }

  const validatePricingAndUpdate = async () => {
    if (!wooProduct) {
      console.warn("No WooCommerce product data available for validation")
      return true // Allow booking to proceed if we can't validate
    }

    try {
      console.log("Validating pricing for product:", wooProduct.id)
      
      // First, get fresh product data to check current price
      const freshProductResponse = await fetch(`/api/woocommerce/product/${wooProduct.id}`)
      if (!freshProductResponse.ok) {
        console.warn("Could not fetch fresh product data, proceeding with current prices")
        return true
      }

      const freshProduct = await freshProductResponse.json()
      const currentBasePrice = parseFloat(freshProduct.price)
      
      console.log("Current base price:", currentBasePrice, "Expected:", product?.price)

      // Check if base price changed significantly (allow 1% tolerance)
      if (product && Math.abs(currentBasePrice - product.price) > Math.max(1, currentBasePrice * 0.01)) {
        alert(`The service price has been updated from Rs. ${product.price} to Rs. ${currentBasePrice}. Please review your booking.`)
        setProduct(p => p ? { ...p, price: currentBasePrice } : null)
        return false
      }

      // If we have addons, validate them too
      if (selectedAddOns.length > 0) {
        const validationData = {
          product_id: wooProduct.id,
          base_price: currentBasePrice,
          addons: selectedAddOns
            .map((id) => {
              const addon = addOns.find((a) => a.id === id)
              if (addon) {
                const finalPrice =
                  addon.discounted && addon.sale_price
                    ? Number.parseFloat(addon.sale_price)
                    : Number.parseFloat(addon.price)
                return { id: addon.id, name: addon.name, price: finalPrice }
              }
              return null
            })
            .filter(Boolean),
          total_price: currentBasePrice + selectedAddOns.reduce((total, addOnId) => {
            const addOn = addOns.find((a) => a.id === addOnId)
            if (addOn) {
              const finalPrice =
                addOn.discounted && addOn.sale_price
                  ? Number.parseFloat(addOn.sale_price)
                  : Number.parseFloat(addOn.price)
              return total + finalPrice
            }
            return total
          }, 0),
        }

        const response = await fetch("/api/woocommerce/validate-pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validationData),
        })

        const result = await response.json()
        if (!result.valid) {
          if (result.error === "BASE_PRICE_CHANGED") {
            alert(result.message)
            setProduct((p) => (p ? { ...p, price: result.current_base_price } : null))
          } else if (result.error === "ADDON_PRICE_CHANGED") {
            alert(result.message)
            setAddOns((prev) =>
              prev.map((a) =>
                a.name === result.addon_name ? { ...a, price: result.current_addon_price.toString() } : a,
              ),
            )
          } else {
            alert(result.message || "Price validation failed.")
          }
          return false
        }

        // Update addon prices if validation returned updated prices
        if (result.validated_data?.real_addon_prices) {
          setAddOns((prev) =>
            prev.map((a) => ({
              ...a,
              price: (result.validated_data.real_addon_prices[a.name] ?? Number.parseFloat(a.price)).toString(),
            })),
          )
        }
      }

      return true
    } catch (e) {
      console.error("Price validation error:", e)
      // Don't block booking if validation fails due to network issues
      console.warn("Price validation failed, proceeding with booking")
      return true
    }
  }

  const handleBooking = async () => {
    if (!wooProduct || !product) return
    setIsSubmitting(true)

    try {
      // Validate pricing before proceeding
      const isPriceValid = await validatePricingAndUpdate()
      if (!isPriceValid) {
        setIsSubmitting(false)
        return
      }

      const bookingData = {
        productId: wooProduct.id,
        ...bookingForm,
        price: calculateTotal(),
        basePrice: product.price,
        selectedAddOns: selectedAddOns,
        area: bookingForm.area === "Other" ? bookingForm.customArea : bookingForm.area,
        appointmentDate: bookingForm.selectedDate,
        appointmentTime: bookingForm.selectedTime,
        specialInstructions: bookingForm.additionalDetails,
      }

      console.log("Submitting booking data:", bookingData)

      const response = await fetch("/api/woocommerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        sessionStorage.setItem(
          "bookingSuccess",
          JSON.stringify({
            ...result,
            serviceName: product.name,
            total: calculateTotal(),
            customerName: `${bookingForm.firstName} ${bookingForm.lastName}`,
            email: bookingForm.email,
            phone: bookingForm.phone,
            appointmentDate: bookingForm.selectedDate,
            appointmentTime: bookingForm.selectedTime,
            selectedAddOns: selectedAddOns
              .map((id) => {
                const addOn = addOns.find((a) => a.id === id)
                if (!addOn) return null
                const finalPrice =
                  addOn.discounted && addOn.sale_price
                    ? Number.parseFloat(addOn.sale_price)
                    : Number.parseFloat(addOn.price)
                return {
                  name: addOn.name,
                  price: finalPrice,
                }
              })
              .filter(Boolean),
          }),
        )
        router.push("/order/success")
      } else {
        throw new Error(result.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Failed to create booking. Please try again or contact support.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCityChange = (city: string) => {
    const selectedCity = cities.find((c) => c.name === city)
    setBookingForm({ ...bookingForm, city, state: selectedCity?.state || "", area: "", customArea: "" })
  }

  const validateStep1 = () =>
    bookingForm.firstName &&
    bookingForm.lastName &&
    bookingForm.email &&
    bookingForm.phone &&
    bookingForm.city &&
    bookingForm.area &&
    bookingForm.address &&
    (bookingForm.area !== "Other" || bookingForm.customArea)

  const validateStep3 = () => bookingForm.selectedDate && bookingForm.selectedTime && bookingForm.agreedToTerms

  const handleNext = () => setCurrentStep((s) => s + 1)
  const handlePrevious = () => setCurrentStep((s) => s - 1)

  if (loading) {
    return <BookingLoader serviceName={product?.name} />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-red-500 mb-6 text-sm md:text-base">{error}</p>
          <Link href="/categories">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white w-full">Browse Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 max-w-md w-full">
          <p className="text-gray-600 mb-4">Service not available.</p>
          <Link href="/categories" className="text-pink-500 hover:underline">
            Browse Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-20">
      <Header />
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />

      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-xs md:text-sm font-medium">Back to Service</span>
            </Link>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>{product.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg p-4 md:p-6">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <CardTitle className="text-lg md:text-2xl font-bold">Book Your Service</CardTitle>
                  <div className="text-xs md:text-sm bg-white/20 px-2 md:px-3 py-1 rounded-full">
                    Step {currentStep} of 3
                  </div>
                </div>
                <Progress value={(currentStep / 3) * 100} className="h-2 md:h-3 bg-white/20" />
              </CardHeader>

              <CardContent className="p-4 md:p-8 mb-8 md:mb-0">
                {currentStep === 1 && (
                  <div className="space-y-4 md:space-y-6">
                    {!isAuthenticated ? (
                      <div className="bg-pink-50 border-l-4 border-pink-500 text-pink-800 p-3 md:p-4 rounded-md" role="alert">
                        <div className="flex">
                          <div className="py-1">
                            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-pink-500 mr-2 md:mr-3" />
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base">Already have an account?</p>
                            <p className="text-xs md:text-sm">
                              <button
                                onClick={() => setIsAuthDialogOpen(true)}
                                className="font-semibold underline hover:text-pink-600"
                              >
                                Log in
                              </button>{" "}
                              to pre-fill your details and for a faster checkout.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="bg-green-50 border-l-4 border-green-500 text-green-800 p-3 md:p-4 rounded-md"
                        role="alert"
                      >
                        <div className="flex">
                          <div className="py-1">
                            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3" />
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base">Welcome back, {user?.name}!</p>
                            <p className="text-xs md:text-sm">Your details have been pre-filled. Please review them below.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                      <p className="text-gray-600 text-sm md:text-base">Please provide your contact details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={bookingForm.firstName}
                          onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                          required
                          className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={bookingForm.lastName}
                          onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                          required
                          className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          required
                          className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          required
                          className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                          City *
                        </Label>
                        <select
                          id="city"
                          value={bookingForm.city}
                          onChange={(e) => handleCityChange(e.target.value)}
                          className="w-full h-10 md:h-12 p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white text-sm md:text-base"
                        >
                          <option value="">Select your city</option>
                          {cities.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {bookingForm.city && (
                        <SearchableAreaDropdown
                          options={areasByCity[bookingForm.city] || []}
                          value={bookingForm.area}
                          onChange={(area) => setBookingForm({ ...bookingForm, area, customArea: "" })}
                          placeholder="Select your area"
                          label="Area"
                          required
                        />
                      )}
                    </div>

                    {bookingForm.area === "Other" && (
                      <div>
                        <Label htmlFor="customArea" className="text-sm font-medium text-gray-700 mb-2 block">
                          Specify Your Area *
                        </Label>
                        <Input
                          id="customArea"
                          value={bookingForm.customArea}
                          onChange={(e) => setBookingForm({ ...bookingForm, customArea: e.target.value })}
                          className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                          placeholder="Enter your specific area"
                        />
                      </div>
                    )}

                    <div className="pb-4">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                        Complete Address *
                      </Label>
                      <Input
                        id="address"
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                        className="h-10 md:h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                        placeholder="Enter your complete address (House #, Street, Landmark)"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Enhance Your Experience</h3>
                      <p className="text-gray-600 text-sm md:text-base">Choose additional services to complement your booking</p>
                    </div>

                    {addOns.length > 0 ? (
                      <div className="space-y-3 md:space-y-4 pb-8">
                        {addOns.map((addOn) => {
                          const originalPrice = Number.parseFloat(addOn.price)
                          const finalPrice =
                            addOn.discounted && addOn.sale_price ? Number.parseFloat(addOn.sale_price) : originalPrice

                          return (
                            <div
                              key={addOn.id}
                              className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedAddOns.includes(addOn.id)
                                  ? "border-pink-300 bg-pink-50 shadow-md"
                                  : "border-gray-200 hover:border-pink-200"
                              }`}
                              onClick={() => handleAddOnToggle(addOn.id)}
                            >
                              <div className="flex items-start space-x-3 md:space-x-4">
                                <Checkbox
                                  id={addOn.id}
                                  checked={selectedAddOns.includes(addOn.id)}
                                  onCheckedChange={() => handleAddOnToggle(addOn.id)}
                                  className="mt-1"
                                />

                                <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  {addOn.image ? (
                                    <Image
                                      src={addOn.image || "/placeholder.svg?height=80&width=80"}
                                      alt={addOn.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 64px, 80px"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <span className="text-xs">No Image</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                    <div className="flex-1 min-w-0">
                                      <Label
                                        htmlFor={addOn.id}
                                        className="font-semibold text-base md:text-lg cursor-pointer text-gray-900 block"
                                      >
                                        {addOn.name}
                                      </Label>
                                      <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">
                                        {addOn.description}
                                      </p>
                                    </div>

                                    <div className="text-right mt-2 md:mt-0 md:ml-4 flex-shrink-0">
                                      {addOn.discounted && addOn.sale_price ? (
                                        <div className="space-y-1">
                                          <div className="text-xs md:text-sm text-gray-500 line-through">RS {originalPrice}</div>
                                          <div className="font-bold text-base md:text-lg text-pink-600">+RS {finalPrice}</div>
                                        </div>
                                      ) : (
                                        <div className="font-bold text-base md:text-lg text-pink-600">+RS {finalPrice}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 md:py-8 pb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 text-sm md:text-base">No additional services available for this booking.</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 md:space-y-6">
                    <DateTimeSelector
                      selectedDate={bookingForm.selectedDate}
                      selectedTime={bookingForm.selectedTime}
                      onDateChange={(date) => setBookingForm({ ...bookingForm, selectedDate: date })}
                      onTimeChange={(time) => setBookingForm({ ...bookingForm, selectedTime: time })}
                    />

                    <div>
                      <Label htmlFor="additionalDetails" className="text-sm font-medium text-gray-700 mb-2 block">
                        Special Instructions or Comments (Optional)
                      </Label>
                      <textarea
                        id="additionalDetails"
                        value={bookingForm.additionalDetails}
                        onChange={(e) => setBookingForm({ ...bookingForm, additionalDetails: e.target.value })}
                        className="w-full h-20 md:h-24 p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 resize-none text-sm md:text-base"
                        placeholder="Any special requests, allergies, or additional information..."
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {bookingForm.additionalDetails.length}/500 characters
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 md:p-4 bg-gray-50 rounded-xl mb-8">
                      <Checkbox
                        id="terms"
                        checked={bookingForm.agreedToTerms}
                        onCheckedChange={(c) => setBookingForm({ ...bookingForm, agreedToTerms: !!c })}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-pink-600 hover:text-pink-700 underline font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline font-medium">
                          Privacy Policy
                        </Link>
                        . I understand that my information will be used to provide the requested service.
                      </Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Booking Summary</h3>
                  <p className="text-pink-100 text-sm">Review your service details</p>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={product.image || "/placeholder.svg?height=80&width=80"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{product.categories[0]?.name}</p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{product.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Service Price</span>
                      <span className="font-bold text-gray-900">RS {product.price}</span>
                    </div>

                    {selectedAddOns.map((id) => {
                      const addOn = addOns.find((a) => a.id === id)
                      if (!addOn) return null

                      const finalPrice =
                        addOn.discounted && addOn.sale_price
                          ? Number.parseFloat(addOn.sale_price)
                          : Number.parseFloat(addOn.price)

                      return (
                        <div key={id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{addOn.name}</span>
                          <span className="font-medium text-gray-900">+RS {finalPrice}</span>
                        </div>
                      )
                    })}

                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-pink-600">RS {calculateTotal()}</span>
                    </div>
                  </div>

                  {bookingForm.firstName && bookingForm.city && (
                    <div className="bg-pink-50 rounded-xl p-4 mt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Booking Details</h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Customer:</span> {bookingForm.firstName}{" "}
                          {bookingForm.lastName}
                        </p>
                        <p>
                          <span className="text-gray-600">Location:</span> {bookingForm.city}
                          {bookingForm.area && `, ${bookingForm.area}`}
                        </p>
                        {bookingForm.selectedDate && bookingForm.selectedTime && (
                          <p>
                            <span className="text-gray-600">Appointment:</span>{" "}
                            {new Date(bookingForm.selectedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at {bookingForm.selectedTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:p-4 z-50">
        <div className="container mx-auto px-2 md:px-4">
          <div className="lg:hidden mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Image
                  src={product.image || "/placeholder.svg?height=40&width=40"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 truncate max-w-32">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-pink-600">RS {calculateTotal()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 border-2 border-gray-200 hover:border-pink-300 bg-transparent text-sm md:text-base"
                >
                  <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Previous</span>
                  <span className="md:hidden">Back</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-pink-600">RS {calculateTotal()}</p>
              </div>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !validateStep1()}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-8 py-2 md:py-3 font-semibold flex items-center space-x-1 md:space-x-2 shadow-lg text-sm md:text-base"
                >
                  <span className="hidden md:inline">Next Step</span>
                  <span className="md:hidden">Next</span>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleBooking}
                  disabled={!validateStep3() || isSubmitting}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 md:px-8 py-2 md:py-3 font-semibold shadow-lg text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden md:inline">Processing...</span>
                      <span className="md:hidden">Wait...</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden md:inline">Complete Booking</span>
                      <span className="md:hidden">Book Now</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
