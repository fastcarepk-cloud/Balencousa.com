// Google Analytics tracking functions
export const GA_TRACKING_ID = "G-PZLLL0QRFN"

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track booking events
export const trackBooking = (service: string, city: string, area: string, price: number) => {
  trackEvent("booking_initiated", "engagement", `${service} - ${city} ${area}`, price)
}

// Track phone calls
export const trackPhoneCall = (location: string) => {
  trackEvent("phone_call", "contact", location)
}

// Track WhatsApp clicks
export const trackWhatsApp = (source: string) => {
  trackEvent("whatsapp_click", "contact", source)
}

// Track CTA button clicks
export const trackCTAClick = (buttonText: string, location: string) => {
  trackEvent("cta_click", "engagement", `${buttonText} - ${location}`)
}

// Track service page views
export const trackServiceView = (service: string, city: string, area: string) => {
  trackEvent("service_page_view", "engagement", `${service} - ${city} ${area}`)
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
