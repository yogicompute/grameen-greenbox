"use client"

import Link from "next/link"
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

type WishlistItem = {
  id: number
  user_id: string
  product_id: number
  added_at: string
  product_name: string | null
  price: number | null
  image_url: string | null
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Load current user and then wishlist
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Error fetching user for wishlist:", error)
        setError("Failed to load user")
        setLoading(false)
        return
      }

      if (!user) {
        setError("You must be logged in to view your wishlist")
        setLoading(false)
        return
      }

      setUserId(user.id)
    }

    loadUser()
  }, [])

  const fetchWishlist = useCallback(async (uid: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to load wishlist")
      }
      const data = await res.json()
      setItems(data.items || [])
    } catch (err: any) {
      console.error("Error fetching wishlist:", err)
      setError(err.message || "Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    fetchWishlist(userId)
  }, [userId, fetchWishlist])

  const removeItem = useCallback(
    async (itemId: number, productId: number) => {
      if (!userId) return
      try {
        const res = await fetch(`/api/wishlist?userId=${encodeURIComponent(userId)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Failed to remove from wishlist")
        }
        setItems((prev) => prev.filter((it) => it.id !== itemId))
      } catch (err: any) {
        console.error("Error removing wishlist item:", err)
        setError(err.message || "Failed to remove from wishlist")
      }
    },
    [userId]
  )

  const clearWishlist = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/wishlist?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to clear wishlist")
      }
      setItems([])
    } catch (err: any) {
      console.error("Error clearing wishlist:", err)
      setError(err.message || "Failed to clear wishlist")
    }
  }, [userId])

  const handleMoveToCart = useCallback(
    async (item: WishlistItem) => {
      if (!userId) return
      try {
        const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.product_id, quantity: 1 }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Failed to move item to cart")
        }
        await removeItem(item.id, item.product_id)
      } catch (err: any) {
        console.error("Error moving wishlist item to cart:", err)
        setError(err.message || "Failed to move item to cart")
      }
    },
    [userId, removeItem]
  )

  const itemCount = useMemo(() => items.length, [items])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <p className="text-red-500">{error}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">Start adding items to your wishlist</p>
            <Link href="/">
              <Button>Explore Products</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-2">{itemCount} item(s) saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_name || "Product image"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2">
                  {item.product_name ?? `Product #${item.product_id}`}
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-primary">
                  ${(item.price ?? 0).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-2">
                <Button className="w-full" onClick={() => handleMoveToCart(item)}>
                  <ShoppingCart className="mr-2" size={16} />
                  Move to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive bg-transparent"
                  onClick={() => removeItem(item.id, item.product_id)}
                >
                  <Heart className="mr-2 fill-current" size={16} />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Button onClick={clearWishlist} variant="ghost">
            Clear Wishlist
          </Button>
        </div>
      </div>
    </main>
  )
}
