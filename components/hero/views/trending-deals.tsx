'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DealProduct {
  id: number
  name: string
  price: number
  original_price?: number | null
  images: string[]
  badge?: string | null
}

export default function TrendingDeals() {
  const [deals, setDeals] = useState<DealProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true)

        const res = await fetch('/api/products')
        const data = await res.json()

        if (data.success) {
          const all: DealProduct[] = (data.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price ?? 0),
            original_price:
              p.original_price !== undefined
                ? Number(p.original_price)
                : p.mrp !== undefined
                ? Number(p.mrp)
                : null,
            images: Array.isArray(p.images) ? p.images : [p.image || ''],
            badge: p.badge ?? null,
          }))

          // shuffle array (Fisher–Yates)
          for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[all[i], all[j]] = [all[j], all[i]]
          }

          // take up to 8 random products
          setDeals(all.slice(0, 8))
        }
      } catch (err) {
        console.error('Failed to fetch trending deals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, deals.length - itemsPerView)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

  const getDiscountPercent = (price: number, original?: number | null) => {
    if (!original || original <= price) return null
    const off = ((original - price) / original) * 100
    return `${Math.round(off)}%`
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-accent" fill="currentColor" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                Trending This Week
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
              Top Deals &amp; Discounts
            </h2>
          </div>

          {deals.length > 0 && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-foreground/60">Loading deals...</p>
            </div>
          </div>
        ) : deals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-foreground/60">No deals available right now.</p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {deals.map((deal, index) => {
                  const discount = getDiscountPercent(deal.price, deal.original_price)
                  return (
                    <div
                      key={deal.id}
                      className="shrink-0 px-3 animate-fade-in-up"
                      style={{
                        width: `${100 / itemsPerView}%`,
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                        {/* Image Container */}
                        <div className="relative overflow-hidden bg-muted h-64 sm:h-72">
                          <img
                            src={(deal.images && deal.images[0]) || '/placeholder.svg'}
                            alt={deal.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 space-y-2">
                            {discount && (
                              <span className="block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                                {discount} OFF
                              </span>
                            )}
                            {(deal.badge || 'Deal') && (
                              <span className="block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                                {deal.badge || 'Deal'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col grow">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {deal.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {formatCurrency(deal.price)}
                            </span>
                            {deal.original_price && deal.original_price > deal.price && (
                              <span className="text-sm text-foreground/50 line-through">
                                {formatCurrency(deal.original_price)}
                              </span>
                            )}
                          </div>
                          <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground mt-auto">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex md:hidden gap-2 justify-center mt-8">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
