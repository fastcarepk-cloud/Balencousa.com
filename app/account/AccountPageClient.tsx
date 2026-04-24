"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, User, Calendar, Settings, LogOut, Briefcase } from 'lucide-react'
import BookingHistory from "@/components/BookingHistory"
import ProfileEditForm from "@/components/ProfileEditForm"
import LoadingSpinner from "@/components/LoadingSpinner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AccountPageClient() {
const { user, isLoading, logout } = useAuth()
const router = useRouter()
const [activeTab, setActiveTab] = useState("overview")

useEffect(() => {
if (!isLoading && !user) {
  router.push("/login")
}
}, [user, isLoading, router])

if (isLoading || !user) {
return (
  <div className="flex h-screen items-center justify-center">
    <LoadingSpinner />
  </div>
)
}

const handleLogout = async () => {
await logout()
router.push("/")
}

return (
<>
  <Header />
  <div className="bg-gray-50 min-h-screen">
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-gray-500 mt-1">Manage your account and bookings.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="mt-4 md:mt-0 bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-200/60">
          <TabsTrigger value="overview">
            <User className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" /> Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start text-sm text-gray-600">
                  <User className="mr-3 h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span className="font-medium text-gray-800">
                    {(user.firstName || user.lastName) ? `${user.firstName} ${user.lastName}`.trim() : "Not provided"}
                  </span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <Phone className="mr-3 h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{user.phone || "Not provided"}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="mr-3 h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span>
                    {user.address && user.city
                      ? `${user.address}, ${user.city}`
                      : user.address || user.city || "Not provided"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge variant="outline">Customer</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/categories" passHref>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Book New Service
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setActiveTab("profile")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-6">
          <BookingHistory />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileEditForm />
        </TabsContent>
      </Tabs>
    </main>
  </div>
  <Footer />
</>
)
}
