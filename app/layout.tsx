import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "GlamUp - Premium Beauty Services at Your Doorstep",
    template: "%s | GlamUp",
  },
  description:
    "Professional beauty services at your home in Pakistan. Waxing, facials, makeup, hair styling and more. Book now in Islamabad, Lahore, Karachi & Rawalpindi.",
  keywords: [
    "beauty services",
    "home salon",
    "waxing",
    "facial",
    "makeup",
    "hair styling",
    "Pakistan",
    "Islamabad",
    "Lahore",
    "Karachi",
    "Rawalpindi",
  ],
  authors: [{ name: "GlamUp" }],
  creator: "GlamUp",
  publisher: "GlamUp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://glamup.pk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://glamup.pk",
    siteName: "GlamUp",
    title: "GlamUp - Premium Beauty Services at Your Doorstep",
    description:
      "Professional beauty services at your home in Pakistan. Book now in Islamabad, Lahore, Karachi & Rawalpindi.",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "GlamUp Beauty Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlamUp - Premium Beauty Services at Your Doorstep",
    description:
      "Professional beauty services at your home in Pakistan. Book now in Islamabad, Lahore, Karachi & Rawalpindi.",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PZLLL0QRFN" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PZLLL0QRFN');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
