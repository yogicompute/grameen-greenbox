"use client"

import { useState, useEffect, useCallback } from "react"
import {supabase} from "@/lib/supabase"

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  image_url?: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", user.id)

        if (error) throw error
        setItems(data || [])
      } else {
        // Fallback to localStorage for non-authenticated users
        const storedCart = localStorage.getItem("shopping-cart")
        if (storedCart) {
          try {
            setItems(JSON.parse(storedCart))
          } catch (e) {
            console.error("[v0] Failed to parse cart:", e)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load cart:", error)
    } finally {
      setIsLoading(false)
      setIsHydrated(true)
    }
  }, [supabase])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = useCallback(
    async (product: {
      id?: string | number
      product_id?: string
      name?: string
      product_name?: string
      price: number
      image?: string
      image_url?: string
    }) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const productId = (product.product_id || String(product.id || "")).toString()
        const productName = product.product_name || product.name || "Unknown Product"
        const imageUrl = product.image_url || product.image

        if (user) {
          // Add to Supabase
          const existingItem = items.find((item) => item.product_id === productId)

          if (existingItem) {
            const { error } = await supabase
              .from("cart_items")
              .update({ quantity: existingItem.quantity + 1 })
              .eq("id", existingItem.id)

            if (error) throw error
            setItems((prev) =>
              prev.map((item) => (item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
            )
          } else {
            const { data, error } = await supabase
              .from("cart_items")
              .insert([
                {
                  user_id: user.id,
                  product_id: productId,
                  product_name: productName,
                  price: product.price,
                  image_url: imageUrl,
                  quantity: 1,
                },
              ])
              .select()

            if (error) throw error
            if (data) setItems((prev) => [...prev, data[0]])
          }
        } else {
          // Fallback to localStorage
          setItems((prev) => {
            const existing = prev.find((item) => item.product_id === productId)
            const updated = existing
              ? prev.map((item) => (item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item))
              : [
                  ...prev,
                  {
                    id: Math.random().toString(),
                    product_id: productId,
                    product_name: productName,
                    price: product.price,
                    quantity: 1,
                    image_url: imageUrl,
                  },
                ]
            localStorage.setItem("shopping-cart", JSON.stringify(updated))
            return updated
          })
        }
      } catch (error) {
        console.error("[v0] Failed to add to cart:", error)
      }
    },
    [supabase, items],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

          if (error) throw error
          setItems((prev) => prev.filter((item) => item.id !== itemId))
        } else {
          const updated = items.filter((item) => item.id !== itemId)
          localStorage.setItem("shopping-cart", JSON.stringify(updated))
          setItems(updated)
        }
      } catch (error) {
        console.error("[v0] Failed to remove from cart:", error)
      }
    },
    [supabase, items],
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

          if (error) throw error
          setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
        } else {
          const updated = items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
          localStorage.setItem("shopping-cart", JSON.stringify(updated))
          setItems(updated)
        }
      } catch (error) {
        console.error("[v0] Failed to update quantity:", error)
      }
    },
    [supabase, items, removeItem],
  )

  const clearCart = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

        if (error) throw error
      } else {
        localStorage.removeItem("shopping-cart")
      }
      setItems([])
    } catch (error) {
      console.error("[v0] Failed to clear cart:", error)
    }
  }, [supabase])

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
  }
}
