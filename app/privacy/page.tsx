import Link from "next/link"
import { Shield, Eye, Lock, Users, FileText, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"

export const metadata = {
  title: "Privacy Policy - GlamUp | Your Data Protection & Privacy Rights",
  description:
    "Learn how GlamUp protects your personal information and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
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
            {/* Quick Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-pink-500" />
                  <span>Quick Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Data Security</h3>
                    <p className="text-sm text-gray-600">Your data is encrypted and securely stored</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">No Sharing</h3>
                    <p className="text-sm text-gray-600">We never sell your personal information</p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Your Rights</h3>
                    <p className="text-sm text-gray-600">You control your data and privacy settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you use GlamUp services, we may collect the following personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Contact Information:</strong> Name, phone number, email address
                </li>
                <li>
                  <strong>Address Information:</strong> Service location, billing address
                </li>
                <li>
                  <strong>Identity Verification:</strong> CNIC details for security purposes
                </li>
                <li>
                  <strong>Payment Information:</strong> Payment method details (processed securely)
                </li>
                <li>
                  <strong>Service Preferences:</strong> Beauty service history and preferences
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and location data (with permission)</li>
                <li>Usage patterns and app interactions</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>

              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Provide Services:</strong> Process bookings, dispatch beauticians, and deliver services
                </li>
                <li>
                  <strong>Communication:</strong> Send booking confirmations, updates, and customer support
                </li>
                <li>
                  <strong>Payment Processing:</strong> Handle transactions and billing
                </li>
                <li>
                  <strong>Safety & Security:</strong> Verify identity and ensure service safety
                </li>
                <li>
                  <strong>Service Improvement:</strong> Analyze usage to enhance our platform
                </li>
                <li>
                  <strong>Marketing:</strong> Send promotional offers (with your consent)
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Meet regulatory and legal requirements
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>

              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information. We may share your information only in these
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Service Providers:</strong> Beauticians need basic contact and location info to provide
                  services
                </li>
                <li>
                  <strong>Payment Processors:</strong> Secure payment processing partners
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> Any other sharing with your explicit permission
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>

              <p className="text-gray-600 mb-4">
                We implement comprehensive security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers with regular security updates</li>
                <li>Access controls and authentication systems</li>
                <li>Regular security audits and monitoring</li>
                <li>Staff training on data protection</li>
                <li>Incident response procedures</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>

              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a portable format
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>

              <p className="text-gray-600 mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve website functionality and user experience</li>
              </ul>
              <p className="text-gray-600 mb-6">
                You can control cookies through your browser settings, but some features may not work properly if
                cookies are disabled.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>

              <p className="text-gray-600 mb-6">
                We retain your personal information only as long as necessary to provide services and comply with legal
                obligations. Typically, we keep:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Account information: Until account deletion</li>
                <li>Service history: 3 years for quality and legal purposes</li>
                <li>Payment records: As required by financial regulations</li>
                <li>Marketing data: Until you opt-out</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>

              <p className="text-gray-600 mb-6">
                Our platform may contain links to third-party websites or integrate with third-party services. We are
                not responsible for the privacy practices of these external services. We encourage you to review their
                privacy policies before providing any personal information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>

              <p className="text-gray-600 mb-6">
                GlamUp services are intended for adults (18+ years). We do not knowingly collect personal information
                from children under 18. If we become aware that we have collected such information, we will take steps
                to delete it promptly.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>

              <p className="text-gray-600 mb-6">
                Your information is primarily stored and processed in Pakistan. If we transfer data internationally, we
                ensure appropriate safeguards are in place to protect your information in accordance with applicable
                data protection laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>

              <p className="text-gray-600 mb-6">
                We may update this privacy policy from time to time to reflect changes in our practices or legal
                requirements. We will notify you of significant changes through the app, email, or website notice. Your
                continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>

              <p className="text-gray-600 mb-4">
                If you have questions about this privacy policy or want to exercise your privacy rights, please contact
                us:
              </p>
            </div>

            {/* Contact Card */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-6 h-6 text-pink-500" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Privacy Officer</h3>
                    <p className="text-gray-600 mb-1">Email: privacy@glamup.pk</p>
                    <p className="text-gray-600 mb-1">Phone: +92 300 123 4567</p>
                    <p className="text-gray-600">Available: Monday - Friday, 9 AM - 6 PM</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mailing Address</h3>
                    <p className="text-gray-600">
                      GlamUp Privacy Department
                      <br />
                      Pakistan
                      <br />
                      For privacy-related inquiries only
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Links */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Related Documents</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/terms" className="text-pink-500 hover:text-pink-600 underline">
                  Terms of Service
                </Link>
                <Link href="/about" className="text-pink-500 hover:text-pink-600 underline">
                  About Us
                </Link>
                <Link href="/categories" className="text-pink-500 hover:text-pink-600 underline">
                  Our Services
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
