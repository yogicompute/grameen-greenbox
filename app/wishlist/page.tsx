"use client"

import Link from "next/link"
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addToCart(item)
    removeItem(item.id)
  }

  if (items.length === 0) {
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
          <p className="text-muted-foreground mt-2">{items.length} item(s) saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2">{item.product_name}</CardTitle>
                <CardDescription className="text-lg font-semibold text-primary">
                  ${item.price.toFixed(2)}
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
                  onClick={() => removeItem(item.id)}
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
