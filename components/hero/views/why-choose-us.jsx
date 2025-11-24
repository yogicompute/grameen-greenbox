'use client'

import { Leaf, Truck, Award, Heart } from 'lucide-react'

const benefits = [
  {
    icon: Leaf,
    title: 'Certified Organic',
    description: 'All products are certified organic and sourced from trusted sustainable farms.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Fresh produce delivered within 24 hours of order placement.',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'Freshness guarantee or your money back. We stand behind our products.',
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    icon: Heart,
    title: 'Eco-Friendly',
    description: 'Sustainable packaging and carbon-neutral shipping to protect our planet.',
    gradient: 'from-primary/20 to-primary/5',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Why Choose GreenCart?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            We're committed to delivering the freshest organic produce with uncompromising quality and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className={`group animate-fade-in-up rounded-2xl bg-linear-to-br ${benefit.gradient} p-8 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-2`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 inline-block p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
