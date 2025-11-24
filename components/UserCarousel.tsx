"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function UserCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=1600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80&auto=format&fit=crop",
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-screen relative"
      onMouseEnter={() => plugin.current?.stop?.()}
      onMouseLeave={() => plugin.current?.reset?.()}
    >
      <CarouselContent className="w-screen">
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="relative w-screen h-96 sm:h-[560px] md:h-[720px] lg:h-[760px]">
              <img
                src={src}
                alt={`Carousel image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* gradient to improve button/text contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

              {/* optional slide title above buttons */}
              <div className="absolute inset-x-0 bottom-20 flex justify-center z-10 pointer-events-none">
                <div className="text-center text-white drop-shadow-md px-4">
                  <h3 className="text-lg sm:text-2xl font-semibold">Slide {index + 1}</h3>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
