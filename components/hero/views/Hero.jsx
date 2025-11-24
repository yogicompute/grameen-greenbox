'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CAROUSEL_IMAGES = [
  {
    url: '/carousel/carousel-1.png',
    alt: 'Fresh organic vegetables and fruits',
    title: 'Premium Organic Produce',
    subtitle: 'Handpicked from sustainable farms',
    description: 'Discover the freshest organic vegetables and fruits delivered to your door',
  },
  {
    url: '/carousel/carousel-2.png',
    alt: 'Colorful fresh vegetables',
    title: 'Seasonal Selection',
    subtitle: 'Nature\'s best every season',
    description: 'Enjoy produce at peak freshness with our rotating seasonal collection',
  },
  {
    url: '/carousel/carousel-3.png',
    alt: 'Farm fresh produce',
    title: 'Direct from Farms',
    subtitle: 'Farm-to-table quality',
    description: 'Skip the middleman and enjoy superior quality at fair prices',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    setAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
    setAutoplay(false)
  }

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {CAROUSEL_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url || '/placeholder.svg'}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-3xl animate-fade-in">
              <p className="text-sm sm:text-base font-semibold uppercase tracking-widest mb-4 text-white/80">
                {image.subtitle}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-4 leading-tight text-balance">
                {image.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed text-balance">
                {image.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setAutoplay(false)
            }}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 h-2'
                : 'bg-white/50 hover:bg-white/70 w-2 h-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter and autoplay toggle */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-3">
        <span className="text-sm font-medium bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
          {currentSlide + 1} / {CAROUSEL_IMAGES.length}
        </span>
        <button
          onClick={() => setAutoplay(!autoplay)}
          className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all backdrop-blur-sm"
          aria-label={autoplay ? 'Pause autoplay' : 'Play autoplay'}
        >
          {autoplay ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  )
}
