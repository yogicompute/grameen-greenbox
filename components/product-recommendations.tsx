'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import { mockProducts } from '@/lib/mock-products'
import { Button } from './ui/button'

interface ProductRecommendationsProps {
  currentProductId: string
}

export default function ProductRecommendations({ currentProductId }: ProductRecommendationsProps) {
  const [scrollIndex, setScrollIndex] = useState(0)

  const recommendations = mockProducts.filter(p => p.id !== currentProductId).slice(0, 4)

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
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
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
                            {product.title}
                          </h3>
                        </div>

                        {/* Rating */}
                        <div>{renderStars(product.rating)}</div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price.toFixed(2)}
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