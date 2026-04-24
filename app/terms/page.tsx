import Link from "next/link"
import { FileText, AlertTriangle, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"

export const metadata = {
  title: "Terms of Service - GlamUp | Service Terms & Conditions",
  description:
    "Read GlamUp's terms of service covering booking policies, service guidelines, payment terms, and user responsibilities for our beauty services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <FileText className="w-16 h-16 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              These terms govern your use of GlamUp services. Please read them carefully before using our platform.
            </p>
            <p className="text-gray-600 mt-4">
              <strong>Last updated:</strong> January 15, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Important Notice */}
            <Alert className="mb-8 border-pink-200 bg-pink-50">
              <AlertTriangle className="h-4 w-4 text-pink-500" />
              <AlertDescription className="text-pink-800">
                <strong>Important:</strong> By using GlamUp services, you agree to these terms. If you don't agree with
                any part of these terms, please don't use our services.
              </AlertDescription>
            </Alert>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>

              <p className="text-gray-600 mb-6">
                By accessing or using GlamUp's website, mobile application, or services, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. These terms apply to all users of the service,
                including customers and service providers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>

              <p className="text-gray-600 mb-4">
                GlamUp is a platform that connects customers with professional beauty service providers for at-home
                services. Our services include but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Makeup services for various occasions</li>
                <li>Hair styling, cutting, and treatments</li>
                <li>Facial treatments and skincare services</li>
                <li>Manicure and pedicure services</li>
                <li>Waxing and hair removal services</li>
                <li>Massage and wellness treatments</li>
                <li>Mehndi/henna application</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Eligibility</h2>

              <p className="text-gray-600 mb-4">To use GlamUp services, you must:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Be at least 18 years old</li>
                <li>Be a female customer (our services are exclusively for women)</li>
                <li>Provide accurate and complete information during registration</li>
                <li>Have the legal capacity to enter into binding agreements</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Account Registration</h2>

              <p className="text-gray-600 mb-4">When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Booking and Cancellation Policy</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking Process</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                <li>All bookings must be made through our platform</li>
                <li>Service confirmation is subject to beautician availability</li>
                <li>We reserve the right to decline bookings at our discretion</li>
                <li>Booking confirmation will be sent via SMS/email</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Free Cancellation:</strong> Up to 2 hours before scheduled service
                </li>
                <li>
                  <strong>Late Cancellation:</strong> 50% charge for cancellations within 2 hours
                </li>
                <li>
                  <strong>No-Show:</strong> Full service charge applies
                </li>
                <li>
                  <strong>Emergency Cancellations:</strong> Considered case-by-case
                </li>
                <li>
                  <strong>Weather/Safety:</strong> Services may be cancelled for safety reasons
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>

              <p className="text-gray-600 mb-4">Payment terms and conditions:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Payment is due at the time of service completion</li>
                <li>We accept cash, mobile payments, and bank transfers</li>
                <li>All prices are in Pakistani Rupees (PKR)</li>
                <li>Prices may vary based on location and service complexity</li>
                <li>Additional charges may apply for premium products or extended services</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>Disputed charges must be reported within 48 hours</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Standards and Quality</h2>

              <p className="text-gray-600 mb-4">We strive to maintain high service standards:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>All beauticians are trained and certified professionals</li>
                <li>We use high-quality, branded beauty products</li>
                <li>Strict hygiene and safety protocols are followed</li>
                <li>Services are performed according to industry standards</li>
                <li>Customer feedback is regularly monitored and addressed</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Responsibilities</h2>

              <p className="text-gray-600 mb-4">As a user, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Provide accurate booking information and location details</li>
                <li>Be present and ready at the scheduled service time</li>
                <li>Provide a safe and appropriate environment for service delivery</li>
                <li>Treat service providers with respect and courtesy</li>
                <li>Report any issues or concerns promptly</li>
                <li>Not misuse or abuse the platform or services</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Prohibited Activities</h2>

              <p className="text-gray-600 mb-4">You may not:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Harass, abuse, or harm service providers</li>
                <li>Provide false or misleading information</li>
                <li>Attempt to circumvent our booking or payment systems</li>
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use automated systems to access our services</li>
                <li>Interfere with the proper functioning of our platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>

              <p className="text-gray-600 mb-6">
                GlamUp acts as a platform connecting customers with independent service providers. While we strive to
                ensure quality services, we cannot guarantee specific outcomes. Our liability is limited to the amount
                paid for the specific service. We are not liable for indirect, incidental, or consequential damages.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Privacy and Data Protection</h2>

              <p className="text-gray-600 mb-6">
                Your privacy is important to us. Our collection, use, and protection of your personal information is
                governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our
                Privacy Policy to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Intellectual Property</h2>

              <p className="text-gray-600 mb-6">
                All content on the GlamUp platform, including text, graphics, logos, images, and software, is the
                property of GlamUp or its licensors and is protected by copyright and other intellectual property laws.
                You may not use our intellectual property without explicit written permission.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>

              <p className="text-gray-600 mb-4">In case of disputes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Contact our customer service team first</li>
                <li>We will attempt to resolve issues through mediation</li>
                <li>Unresolved disputes will be subject to Pakistani law</li>
                <li>Legal proceedings must be conducted in Pakistani courts</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Service Modifications</h2>

              <p className="text-gray-600 mb-6">
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We will
                provide reasonable notice of significant changes that may affect your use of the service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Termination</h2>

              <p className="text-gray-600 mb-6">
                We may terminate or suspend your account and access to services immediately, without prior notice, for
                conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for
                any other reason at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>

              <p className="text-gray-600 mb-6">
                We may update these terms from time to time. We will notify you of significant changes through the app,
                email, or website notice. Your continued use of our services after such changes constitutes acceptance
                of the updated terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Governing Law</h2>

              <p className="text-gray-600 mb-6">
                These terms are governed by and construed in accordance with the laws of Pakistan. Any legal action or
                proceeding arising under these terms will be brought exclusively in the courts of Pakistan.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contact Information</h2>

              <p className="text-gray-600 mb-4">If you have questions about these terms, please contact us:</p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-6 h-6 text-pink-500" />
                    <span>Customer Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-1">Phone: +92 300 123 4567</p>
                  <p className="text-gray-600 mb-1">Email: support@glamup.pk</p>
                  <p className="text-gray-600">Available: 7 days a week, 9 AM - 9 PM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-pink-500" />
                    <span>Legal Department</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-1">Email: legal@glamup.pk</p>
                  <p className="text-gray-600 mb-1">For legal and compliance matters</p>
                  <p className="text-gray-600">Response time: 2-3 business days</p>
                </CardContent>
              </Card>
            </div>

            {/* Related Links */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Related Documents</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy" className="text-pink-500 hover:text-pink-600 underline">
                  Privacy Policy
                </Link>
                <Link href="/about" className="text-pink-500 hover:text-pink-600 underline">
                  About Us
                </Link>
                <Link href="/categories" className="text-pink-500 hover:text-pink-600 underline">
                  Our Services
                </Link>
                <Link href="/careers" className="text-pink-500 hover:text-pink-600 underline">
                  Careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
