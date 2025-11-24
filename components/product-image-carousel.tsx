'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductImageCarouselProps {
  images: string[]
  productTitle: string
}

export default function ProductImageCarousel({ images, productTitle }: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const handlePrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-8">
      {/* Main Image */}
      <div
        className="relative w-full aspect-square bg-secondary rounded-lg overflow-hidden group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[selectedIndex] || "/placeholder.svg"}
          alt={`${productTitle} - Image ${selectedIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
        />
        <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} className="text-gray-700" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
