'use client'

import { useMemo, useState } from 'react'
import {
  Star,
  User,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
} from 'lucide-react'
import { Product } from '@/lib/mock-products'

interface ProductReviewsProps {
  product: Product
}

const sampleReviews = [
  {
    id: 1,
    author: 'Raj Kumar',
    rating: 5,
    date: '2 weeks ago',
    title: 'Excellent quality!',
    content:
      'Best basmati rice I have ever bought. The grains are long and aromatic. Highly recommended!',
    helpful: 124,
  },
  {
    id: 2,
    author: 'Priya Singh',
    rating: 4,
    date: '1 month ago',
    title: 'Good value for money',
    content:
      'Great product at reasonable price. Delivery was fast. Will buy again.',
    helpful: 89,
  },
  {
    id: 3,
    author: 'Amit Patel',
    rating: 5,
    date: '1 month ago',
    title: 'Perfect for biryani',
    content:
      'Used this rice for making biryani and it turned out amazing. The quality is premium.',
    helpful: 156,
  },
]

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({})
  const [helpfulState, setHelpfulState] = useState<Record<number, boolean>>({})

  // replace with real data in app
  const reviews = sampleReviews

  const filteredReviews = useMemo(
    () => (selectedRating ? reviews.filter(r => r.rating === selectedRating) : reviews),
    [reviews, selectedRating]
  )

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  }, [reviews])

  const ratingCounts = useMemo(() => {
    const map = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => {
      map[r.rating as 1 | 2 | 3 | 4 | 5]++
    })
    return map
  }, [reviews])

  function toggleExpand(id: number) {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleHelpful(id: number) {
    setHelpfulState(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            Customer Reviews
            <span className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-50 to-transparent text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-100">
              <Star size={14} /> {averageRating}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}.
          </p>
        </div>

        <div className="hidden sm:flex gap-2 items-center">
          <button
            onClick={() => setSelectedRating(null)}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              selectedRating === null ? 'bg-foreground text-white' : 'bg-secondary text-foreground'
            }`}
            aria-pressed={selectedRating === null}
          >
            All
          </button>

          {[5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRating(prev => (prev === r ? null : r))}
              className={`px-3 py-1.5 rounded-md text-sm transition flex items-center gap-2 ${
                selectedRating === r ? 'bg-foreground text-white' : 'bg-secondary text-foreground'
              }`}
              aria-pressed={selectedRating === r}
              title={`${r} stars`}
            >
              <span className="inline-flex items-center gap-1">
                {r}
                <Star size={12} />
              </span>
              <span className="text-xs text-muted-foreground">({ratingCounts[r as 5 | 4 | 3 | 2 | 1]})</span>
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary */}
        <aside className="col-span-1 p-5 rounded-xl border border-border bg-linear-to-b from-white/60 to-white/30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full w-16 h-16 bg-emerald-50 flex items-center justify-center text-2xl font-semibold text-emerald-700">
              {averageRating}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Average rating</div>
              <div className="text-lg font-semibold">{averageRating} / 5</div>
              <div className="text-xs text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts[star as 5 | 4 | 3 | 2 | 1]
              const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <div className="w-8 text-xs text-muted-foreground flex items-center gap-1">
                    {star}
                    <Star size={12} />
                  </div>

                  <div className="flex-1 h-3 rounded overflow-hidden bg-secondary/10">
                    <div style={{ width: `${percent}%` }} className="h-3 bg-emerald-500/60 transition-all" />
                  </div>

                  <div className="w-8 text-xs text-muted-foreground text-right">{count}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <ThumbsUp size={14} />
            Verified purchases are prioritized
          </div>
        </aside>

        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          {/* small mobile filter */}
          <div className="flex gap-2 sm:hidden">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-3 py-1.5 rounded-md text-sm transition ${selectedRating === null ? 'bg-foreground text-white' : 'bg-secondary text-foreground'}`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRating(prev => (prev === r ? null : r))}
                className={`px-3 py-1.5 rounded-md text-sm transition ${selectedRating === r ? 'bg-foreground text-white' : 'bg-secondary text-foreground'}`}
              >
                {r}★
              </button>
            ))}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="flex items-center justify-between gap-4 p-4 rounded-full border border-dashed border-border bg-white/40">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">No reviews yet</div>
                  <div className="text-xs text-muted-foreground">Share your experience — help others decide.</div>
                </div>
              </div>

              <button
                onClick={() => window.alert('Open review form — integrate form in app flow')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full shadow-sm hover:scale-105 transition-transform"
                aria-label="Add your first review"
              >
                <Plus size={16} />
                Add your first review
              </button>
            </div>
          ) : (
            filteredReviews.map(review => (
              <article
                key={review.id}
                className="flex gap-4 p-4 rounded-xl border border-border bg-white/60 shadow-sm"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold">
                    {review.author.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-muted-foreground/60'}>★</span>
                          ))}
                        </div>

                        <h3 className="text-sm font-semibold text-foreground">{review.title}</h3>
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {review.author} • {review.date}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggleHelpful(review.id)}
                        className={`inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full ${
                          helpfulState[review.id] ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground hover:text-emerald-700'
                        }`}
                        aria-pressed={!!helpfulState[review.id]}
                      >
                        <ThumbsUp size={14} />
                        <span>{helpfulState[review.id] ? review.helpful + 1 : review.helpful}</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(review.id)}
                        className="text-xs text-muted-foreground inline-flex items-center gap-1"
                      >
                        {expandedIds[review.id] ? (<><ChevronUp size={12} /> Less</>) : (<><ChevronDown size={12} /> More</>)}
                      </button>
                    </div>
                  </div>

                  <p className={`mt-3 text-sm text-muted-foreground ${expandedIds[review.id] ? '' : 'line-clamp-3'}`}>
                    {review.content}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
