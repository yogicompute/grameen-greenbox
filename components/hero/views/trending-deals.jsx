'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const deals = [
  {
    id: 1,
    name: 'Organic Strawberries',
    price: '$6.99',
    originalPrice: '$9.99',
    discount: '30%',
    image: '/fresh-red-organic-strawberries.jpg',
    badge: 'Limited Time',
  },
  {
    id: 2,
    name: 'Heirloom Tomatoes',
    price: '$5.49',
    originalPrice: '$7.99',
    discount: '31%',
    image: '/fresh-heirloom-tomatoes.jpg',
    badge: 'Top Deal',
  },
  {
    id: 3,
    name: 'Baby Spinach Bundle',
    price: '$3.99',
    originalPrice: '$5.99',
    discount: '33%',
    image: '/fresh-organic-baby-spinach.jpg',
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'Organic Blueberries',
    price: '$7.99',
    originalPrice: '$11.99',
    discount: '33%',
    image: '/fresh-organic-blueberries.jpg',
    badge: 'Limited Time',
  },
]

export default function TrendingDeals() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

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
              Top Deals & Discounts
            </h2>
          </div>

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
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-all duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
            {deals.map((deal, index) => (
              <div
                key={deal.id}
                className={`shrink-0 px-3 animate-fade-in-up`}
                style={{
                  width: `${100 / itemsPerView}%`,
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-muted h-64 sm:h-72">
                    <img
                      src={deal.image || "/placeholder.svg"}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 space-y-2">
                      <span className="block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                        {deal.discount} OFF
                      </span>
                      <span className="block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        {deal.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {deal.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {deal.price}
                      </span>
                      <span className="text-sm text-foreground/50 line-through">
                        {deal.originalPrice}
                      </span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground mt-auto">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
      </div>
    </section>
  )
}
