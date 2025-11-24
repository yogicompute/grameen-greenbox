'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/mock-products'

interface ProductDetailsSectionProps {
  product: Product
}

export default function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    // Make this a full-height column so the parent card and the image column stay visually balanced.
    <div className="flex flex-col h-full">
      {/* Top content: header, rating, price, stock & delivery */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full ${
                    i < Math.floor(product.rating)
                      ? 'bg-yellow-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviews} reviews • Rating: {product.rating}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-primary">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-500/20 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        {/* Stock and Shipping Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Stock Status</p>
            <p className="font-semibold text-foreground">
              {product.stockStatus?.count || 0} in stock
            </p>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Delivery</p>
            <p className="font-semibold text-foreground">2-3 Days</p>
          </div>
        </div>
      </div>

      {/* Middle: description/controls area grows so actions can be anchored to the bottom */}
      <div className="mt-4 overflow-y-auto">
        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Quantity</label>
          <div className="flex items-center gap-3 border border-border rounded-lg w-fit p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-secondary transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-secondary transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* A small spacer so the scrolling region doesn't butt up to the actions */}
        <div className="h-4" />
      </div>

      {/* Bottom actions anchored with mt-auto to ensure alignment with the image column */}
      <div className="mt-auto space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2 py-4 text-base">
            <ShoppingCart size={20} />
            Add to Cart
          </Button>
          <Button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`px-6 py-4 border-2 ${
              isWishlisted
                ? 'bg-red-50 border-red-500 text-red-500'
                : 'bg-transparent border-border text-foreground hover:bg-secondary'
            }`}
            variant="outline"
            aria-pressed={isWishlisted}
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-current' : ''}
            />
          </Button>
        </div>

        {/* Buy Now */}
        <Button className="w-full bg-secondary text-foreground hover:bg-secondary/80 py-4 text-base">
          Buy Now
        </Button>

        {/* Info Cards */}
        <div className="pt-7 border-t border-border flex w-full justify-between items-center ">
          <div className="flex gap-3 p-3 bg-secondary/50 rounded">
            <Truck className="text-primary shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm text-foreground">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders above ₹500</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-secondary/50 rounded">
            <RotateCcw className="text-primary shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm text-foreground">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
