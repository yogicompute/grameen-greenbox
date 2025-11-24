"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {supabase} from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // format full name: capitalize first letter of each word
  const formatFullName = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.displayName.trim()) {
        setError("Full name is required")
        return false
      }
      if (formData.displayName.trim().length < 2) {
        setError("Full name must be at least 2 characters")
        return false
      }
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.password.trim()) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (isSignUp) {
        const formattedName = formatFullName(formData.displayName || "")
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
            data:{
                display_name: formattedName || undefined
            }
          },
        })

        if (error) {
          setError(error.message)
          setIsLoading(false)
          return
        }

        setError("")
        // update stored formData to formatted full name for clarity
        setFormData({ displayName: formattedName, email: "", password: "", confirmPassword: "" })
        alert("Sign up successful! Please check your email for confirmation.")
        setIsSignUp(false)
        // Notify parent that auth flow succeeded so callers can resume (e.g., reopen address modal)
        onSuccess()
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setError(error.message)
          setIsLoading(false)
          return
        }

        setError("")
        setFormData({ displayName: "", email: "", password: "", confirmPassword: "" })
        onSuccess()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("[v0] Auth error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-secondary rounded transition-colors">
          <X size={20} />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Sign up to get started" : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    name="displayName"
                    placeholder="Your full name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                  />
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin mr-2" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError("")
              }}
              className="font-semibold text-primary hover:underline transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
