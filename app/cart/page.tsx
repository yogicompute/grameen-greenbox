"use client"

import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
  const total = getTotalPrice()
  const tax = total * 0.1
  const finalTotal = total + tax

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
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 text-center h-9"
                        />
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
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
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
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
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full">Proceed to Checkout</Button>

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
