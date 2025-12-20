'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import { Button } from './ui/button'

interface ProductRecommendationsProps {
  currentProductId: number
  currentCategory?: string
}

type RemoteProduct = {
  id: number
  name: string
  category: string
  price: number
  images: string[]
  ratings: number
  product_description?: string | null
  review_count?: number
}

export default function ProductRecommendations({ currentProductId, currentCategory }: ProductRecommendationsProps) {
  const [scrollIndex, setScrollIndex] = useState(0)
  const [recommendations, setRecommendations] = useState<RemoteProduct[]>([])

  useEffect(() => {
    let mounted = true

    const fetchRecommendations = async () => {
      try {
  // fetch products using same API as /shop; prefer same-category items and sort by rating
  const params = new URLSearchParams()
  if (currentCategory) params.append('category', String(currentCategory))
  params.append('sortBy', 'rating')
  const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) return
        const json = await res.json()
        if (!mounted) return

        const items = (json.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price ?? 0),
          images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
          ratings: Number(p.ratings ?? p.rating ?? 0),
          product_description: p.product_description ?? null,
          review_count: p.review_count ?? 0,
        })) as RemoteProduct[]

        const currId = Number(currentProductId)
        const filtered = items.filter(item => item.id !== currId).slice(0, 4)
        setRecommendations(filtered)
      } catch (err) {
        console.error('Failed to load recommendations', err)
      }
    }

    fetchRecommendations()
    return () => {
      mounted = false
    }
  }, [currentProductId])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Recommended Products</h2>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map(product => (
            <div
              key={product.id}
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
                    ${Number(product.price).toFixed(2)}
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
          ))}
        </div>
      </div>
    </div>
  )
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