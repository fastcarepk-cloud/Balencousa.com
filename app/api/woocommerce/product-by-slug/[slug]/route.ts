import { NextResponse } from 'next/server'
import { fetchProductBySlug } from '@/lib/woocommerce-api'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const product = await fetchProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error)
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 })
  }
}
