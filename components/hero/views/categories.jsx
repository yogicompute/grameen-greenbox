'use client'
import Link from 'next/link'
import { Leaf, Bean, Wheat } from 'lucide-react'

const categories = [
  {
    icon: Bean,
    name: 'Pulses (Dals)',
    description: 'Protein-rich lentils for everyday cooking.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    href:"/shop?category=Pulses"
  },
  {
    icon: Leaf,
    name: 'Natural Goodness',
    description: 'Pure, wholesome foods promoting better health.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    href:"/shop?category=Natural+Goodness"
  },
  {
    icon: Wheat,
    name: 'Grains',
    description: 'Aromatic grains for perfect daily meals.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    href:"/shop?category=Grains"
  },
]

export default function Categories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-foreground/70">
            Explore our curated selection of premium organic products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                href={category.href}
                key={index}
                className="group animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`${category.bgColor} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-transparent group-hover:border-primary/20`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                      <Icon className={`w-8 h-8 ${category.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {category.description}
                  </p>
                  <div className="mt-4 inline-block text-primary font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
