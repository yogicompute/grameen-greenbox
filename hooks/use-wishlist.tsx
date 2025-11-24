"use client"

import { useState, useEffect, useCallback } from "react"
import {supabase} from "@/lib/supabase"

export interface WishlistItem {
  id: string
  product_id: string
  product_name: string
  price: number
  image_url?: string
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const loadWishlist = useCallback(async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase.from("wishlist_items").select("*").eq("user_id", user.id)

        if (error) throw error
        setItems(data || [])
      } else {
        // Fallback to localStorage for non-authenticated users
        const storedWishlist = localStorage.getItem("shopping-wishlist")
        if (storedWishlist) {
          try {
            setItems(JSON.parse(storedWishlist))
          } catch (e) {
            console.error("[v0] Failed to parse wishlist:", e)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load wishlist:", error)
    } finally {
      setIsLoading(false)
      setIsHydrated(true)
    }
  }, [supabase])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const toggleWishlist = useCallback(
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
          // Check if exists
          const existingItem = items.find((item) => item.product_id === productId)

          if (existingItem) {
            // Remove from Supabase
            const { error } = await supabase.from("wishlist_items").delete().eq("id", existingItem.id)

            if (error) throw error
            setItems((prev) => prev.filter((item) => item.product_id !== productId))
          } else {
            // Add to Supabase
            const { data, error } = await supabase
              .from("wishlist_items")
              .insert([
                {
                  user_id: user.id,
                  product_id: productId,
                  product_name: productName,
                  price: product.price,
                  image_url: imageUrl,
                },
              ])
              .select()

            if (error) throw error
            if (data) setItems((prev) => [...prev, data[0]])
          }
        } else {
          // Fallback to localStorage
          setItems((prev) => {
            const exists = prev.some((item) => item.product_id === productId)
            const updated = exists
              ? prev.filter((item) => item.product_id !== productId)
              : [
                  ...prev,
                  {
                    id: Math.random().toString(),
                    product_id: productId,
                    product_name: productName,
                    price: product.price,
                    image_url: imageUrl,
                  },
                ]
            localStorage.setItem("shopping-wishlist", JSON.stringify(updated))
            return updated
          })
        }
      } catch (error) {
        console.error("[v0] Failed to toggle wishlist:", error)
      }
    },
    [supabase, items],
  )

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
        const exists = items.some((item) => item.product_id === productId)

        if (!exists) {
          await toggleWishlist(product)
        }
      } catch (error) {
        console.error("[v0] Failed to add to wishlist:", error)
      }
    },
    [supabase, items, toggleWishlist],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

          if (error) throw error
          setItems((prev) => prev.filter((item) => item.id !== itemId))
        } else {
          const updated = items.filter((item) => item.id !== itemId)
          localStorage.setItem("shopping-wishlist", JSON.stringify(updated))
          setItems(updated)
        }
      } catch (error) {
        console.error("[v0] Failed to remove from wishlist:", error)
      }
    },
    [supabase, items],
  )

  const clearWishlist = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id)

        if (error) throw error
      } else {
        localStorage.removeItem("shopping-wishlist")
      }
      setItems([])
    } catch (error) {
      console.error("[v0] Failed to clear wishlist:", error)
    }
  }, [supabase])

  return {
    items,
    isLoading,
    toggleWishlist,
    addItem,
    removeItem,
    clearWishlist,
  }
}
