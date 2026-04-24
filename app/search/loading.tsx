import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Loader2 } from "lucide-react"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-600 mb-4" />
          <p className="text-gray-600">Loading search page...</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
