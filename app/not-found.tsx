import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The service or category you're looking for might have
          been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3">Go Home</Button>
          </Link>
          <Link href="/categories">
            <Button
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 bg-transparent"
            >
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
