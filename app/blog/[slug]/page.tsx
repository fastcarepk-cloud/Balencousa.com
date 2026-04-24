import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, ArrowLeft, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import { getBlogPostBySlug } from "@/lib/data-loader"

// Replace the getBlogPost function with:
const getBlogPost = (slug: string) => {
  return getBlogPostBySlug(slug)
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/blog" className="text-gray-600 hover:text-pink-500 transition-colors">
            Blog
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{post.title}</span>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <Badge className="bg-pink-500 text-white mb-4">{post.category}</Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <Image
                  src="/images/mehndi-service.jpg"
                  alt="Related post"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="p-6">
                  <Badge className="bg-pink-500 text-white mb-2">Mehndi</Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">The Ultimate Guide to Mehndi Designs</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    From traditional patterns to modern styles, explore the most beautiful mehndi designs...
                  </p>
                  <Link href="/blog/ultimate-guide-mehndi-designs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                    >
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <Image
                  src="/images/mehndi-service.jpg"
                  alt="Related post"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="p-6">
                  <Badge className="bg-pink-500 text-white mb-2">Hair Care</Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Hair Care Routine for Pakistani Weather</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Protect and nourish your hair in Pakistan's challenging climate...
                  </p>
                  <Link href="/blog/hair-care-routine-pakistani-weather">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent"
                    >
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
