'use client'

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Your Store</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making your life easier, helping you enjoy life and making it better every day.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Shop', 'Categories', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone size={16} />
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a href="mailto:support@store.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail size={16} />
                  support@store.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>123 Store Street, City, Country</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Subscribe to get special offers and updates.</p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Your Store. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
