'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  category: string
  price: number
  images: string[]
  ratings: number
  product_description?: string | null
  review_count?: number
}

const CATEGORIES = [
  { id: 'all', name: 'All Products', value: undefined },
  { id: 'pulses', name: 'Pulses (Dals)', value: 'Pulses' },
  { id: 'grains', name: 'Grains', value: 'Grains' },
  { id: 'natural', name: 'Natural Goodness', value: 'Natural Goodness' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'name'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        if (category) params.append('category', category)
        if (search) params.append('search', search)
        params.append('sortBy', sortBy)

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          const normalized = (data.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price ?? 0),
            images: Array.isArray(p.images) ? p.images : [p.image || ""],
            ratings: Number(p.ratings ?? p.rating ?? 0),
            product_description: p.product_description ?? null,
            review_count: p.review_count ?? 0,
          }))
          setProducts(normalized)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, search, sortBy])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCategoryChange = (newCategory: string | undefined) => {
    const params = new URLSearchParams()
    if (newCategory) params.append('category', newCategory)
    if (search) params.append('search', search)
    if (sortBy !== 'name') params.append('sortBy', sortBy)
    
    router.push(`/shop?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    if (newSort !== 'name') params.append('sortBy', newSort)
    
    router.push(`/shop?${params.toString()}`)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-accent text-accent'
                : 'text-border'
            }`}
          />
        ))}
        <span className="text-sm text-foreground/60 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Shop
          </h1>
          <p className="text-lg text-foreground/60">
            {search ? `Results for "${search}"` : 'Browse our premium organic products'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="space-y-8 sticky top-24">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`cursor-pointer  block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        category === cat.value
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full cursor-pointer px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option className="cursor-pointer" key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-foreground/60">Loading products...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <p className="text-sm text-foreground/60 mb-6">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link href={`/shop/${product.id}`} key={product.id}>
                    <div
                      className="group cursor-pointer rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 bg-card"
                    >
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <img
                          src={(product.images && product.images[0]) || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-primary uppercase font-semibold tracking-wider mb-1">
                            {product.category}
                          </p>
                          <h3 className="font-semibold text-foreground line-clamp-2">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        <div>{renderStars(product.ratings)}</div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{Number(product.price).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-secondary text-primary-foreground cursor-pointer"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-lg text-foreground/60 mb-4">No products found</p>
                  <Button
                    onClick={() => router.push('/shop')}
                    className="bg-primary hover:bg-secondary text-primary-foreground"
                  >
                    View All Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}
