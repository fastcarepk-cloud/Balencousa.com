import { CheckCircle, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Header from "@/components/Header"

export default function OrderSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Success Header Skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-32 mx-auto animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details Card Skeleton */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  <div className="h-6 bg-white/20 rounded w-48 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg">
                      <div className="h-4 bg-white/20 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-8 bg-white/20 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sharing Options Skeleton */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex flex-col items-center space-y-2 h-20 py-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer Card Skeleton */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600 animate-pulse" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-36 mx-auto animate-pulse"></div>
              </CardContent>
            </Card>

            {/* Next Steps Skeleton */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0 mt-0.5"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions Skeleton */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-10 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
