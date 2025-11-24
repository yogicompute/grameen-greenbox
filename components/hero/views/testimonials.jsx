'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Food Enthusiast',
    content: 'The quality of produce is exceptional. Everything arrives fresh and the sustainability packaging is impressive. I\'ve switched completely!',
    rating: 5,
    image: '/smiling-woman-portrait.png',
  },
  {
    name: 'James Chen',
    role: 'Health Coach',
    content: 'I recommend GreenCart to all my clients. The organic certification is legitimate, and the taste difference is undeniable.',
    rating: 5,
    image: '/smiling-man-portrait.png',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Chef',
    content: 'As a professional chef, I\'m particular about my ingredients. GreenCart sources the best seasonal produce available.',
    rating: 5,
    image: '/woman-chef-portrait.png',
  },
  {
    name: 'David Park',
    role: 'Sustainability Officer',
    content: 'Their commitment to eco-friendly practices aligns perfectly with my values. Fast delivery and zero waste packaging!',
    rating: 5,
    image: '/professional-man-portrait.png',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-lg text-foreground/70">
            See what our satisfied customers have to say
          </p>
        </div>

        <div className="relative">
          {/* Testimonials Carousel */}
          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xl">
            <div className="relative h-80 flex items-center justify-center px-8 sm:px-12">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute w-full px-8 sm:px-12 transition-all duration-500 transform ${
                    index === currentIndex
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="text-center">
                    {/* Rating */}
                    <div className="flex gap-1 justify-center mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-accent text-accent"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-lg text-foreground mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-center mt-8">
            <button
              onClick={handlePrev}
              className="p-3 hover:bg-primary/10 rounded-full transition-colors border border-primary/20 hover:border-primary/40"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-primary/20 hover:bg-primary/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 hover:bg-primary/10 rounded-full transition-colors border border-primary/20 hover:border-primary/40"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
