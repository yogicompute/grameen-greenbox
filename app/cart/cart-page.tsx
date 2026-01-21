"use client"

import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import {formatCurrency} from "@/lib/utils"

type CartItem = {
  id: number
  cart_id: number
  product_id: number
  quantity: number
  added_at: string
   // Enriched product info from API
   product_name: string | null
   price: number | null
   image_url: string | null
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // 1. Get the current user (Supabase Auth)
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Error fetching user for cart:", error)
        setError("Failed to load user")
        setLoading(false)
        return
      }

      if (!user) {
        setError("You must be logged in to view your cart")
        setLoading(false)
        return
      }

      setUserId(user.id)
    }

    loadUser()
  }, [])

  // 2. Fetch cart items from /api/cart
  const fetchCart = useCallback(async (uid: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/cart?userId=${encodeURIComponent(uid)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to load cart")
      }

      const data = await res.json()
      setItems(data.items || [])
    } catch (err: any) {
      console.error("Error fetching cart:", err)
      setError(err.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [])

  // Load cart once we know the user
  useEffect(() => {
    if (!userId) return
    fetchCart(userId)
  }, [userId, fetchCart])

  // 3. Update quantity
  const removeItem = useCallback(
    async (itemId: number) => {
      if (!userId) return
      try {
        const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Failed to remove cart item")
        }
        setItems((prev) => prev.filter((it) => it.id !== itemId))
      } catch (err: any) {
        console.error("Error removing item:", err)
        setError(err.message || "Failed to remove cart item")
      }
    },
    [userId]
  )

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (!userId) return
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }

      try {
        const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, quantity }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Failed to update cart item")
        }

        // Optimistic local update
        setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, quantity } : it)))
      } catch (err: any) {
        console.error("Error updating quantity:", err)
        setError(err.message || "Failed to update cart item")
      }
    },
    [userId, removeItem]
  )

  // 4. Clear cart
  const clearCart = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to clear cart")
      }
      setItems([])
    } catch (err: any) {
      console.error("Error clearing cart:", err)
      setError(err.message || "Failed to clear cart")
    }
  }, [userId])

  // 5. Totals
  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.price ?? 0
        return sum + price * item.quantity
      }, 0),
    [items]
  )
  const tax = useMemo(() => subtotal * 0.1, [subtotal])
  const finalTotal = useMemo(() => subtotal + tax, [subtotal, tax])

  // 6. UI states
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground">Loading your cart...</p>
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
            Go back
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart to get started</p>
            <Link href="/">
              <Button>Start Shopping</Button>
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
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.product_name || "Product image"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product_name ?? `Product #${item.product_id}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price ?? 0)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number.parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center h-9"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:bg-destructive/10 ml-auto"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency((((item.price ?? 0) as number) * item.quantity))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                {/* TODO: checkout button should work */}
                {/* <Button className="w-full">Proceed to Checkout</Button> */}

                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
