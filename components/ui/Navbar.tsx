"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MaxWidthContainer from "../MaxWidthContainer";
import ALL_PRODUCTS from "@/lib/products.json";
import { supabase } from "@/lib/supabase";
import { Button } from "./button";
import { Menu, X, LogOut, ShoppingCartIcon, HeartIcon } from "lucide-react";
import { AuthModal } from "../modals/auth-modal";
import { LocationDropdown } from "../location-dropdown";
import AddressModal from "../modals/address-modal";

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Auth
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    email?: string;
    displayName?: string | null;
  } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<any | null>(null);
  const [addressDraft, setAddressDraft] = useState<Partial<any> | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [reopenAddressAfterAuth, setReopenAddressAfterAuth] = useState(false);

  // simple normalized matcher
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (normalizedQuery.length < 2) return [];
    return (ALL_PRODUCTS as any[])
      .filter((p) =>
        `${p.name} ${p.category}`.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);
  }, [normalizedQuery]);

  useEffect(() => {
    setActiveIndex(-1);

    const getUser = async () => {
      try {
        const {
          data: { user: supaUser },
        } = await supabase.auth.getUser();

        if (supaUser) {
          // read display_name from user metadata (fall back to email prefix)
          const meta = (supaUser.user_metadata ?? {}) as any;
          const displayName =
            meta?.display_name ||
            meta?.full_name ||
            (supaUser.email ? supaUser.email.split("@")[0] : undefined);

          setUser({ email: supaUser.email || "", displayName });
          // fetch addresses for this user
          fetchAddresses(supaUser.id).catch((e) =>
            console.error("Failed to fetch addresses:", e)
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = (session.user.user_metadata ?? {}) as any;
        const displayName =
          meta?.display_name ||
          meta?.full_name ||
          (session.user.email ? session.user.email.split("@")[0] : undefined);

        setUser({ email: session.user.email || "", displayName });
        fetchAddresses(session.user.id).catch((e) =>
          console.error("Failed to fetch addresses:", e)
        );
      } else {
        setUser(null);
        setAddresses([]);
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [results.length, supabase]);

  // fetch addresses helper
  const fetchAddresses = async (userId?: string | null) => {
    try {
      if (!userId) return;
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });
      if (error) throw error;
      setAddresses(data ?? []);
    } catch (err) {
      console.error("fetchAddresses error:", err);
      setAddresses([]);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsMobileMenuOpen(false);
    if (reopenAddressAfterAuth) {
      setAddressModalOpen(true);
      setReopenAddressAfterAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("[v0] Failed to sign out:", error);
    }
  };

  // keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    // only handle arrows/enter when results exist
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      // on submit via Enter — always show shop results page (per request)
      e.preventDefault();
      const q = query.trim();
      const target = q ? `/shop?search=${encodeURIComponent(q)}` : `/shop`;
      window.location.href = target;
    }
  }

  const wishlistCount = 0;
  const cartCount = 0;

  function highlight(text: string) {
    if (!normalizedQuery) return text;
    const idx = text.toLowerCase().indexOf(normalizedQuery);
    if (idx === -1) return text;
    const start = text.slice(0, idx);
    const match = text.slice(idx, idx + normalizedQuery.length);
    const end = text.slice(idx + normalizedQuery.length);
    return (
      <>
        {start}
        <span className="bg-yellow-100 text-foreground font-semibold px-0.5 rounded">
          {match}
        </span>
        {end}
      </>
    );
  }

  // helper: return only first name, first letter capitalized
  const formatFirstName = (value?: string | null) => {
    if (!value) return "";
    const token = value.trim().split(/\s+|[._-]/)[0] || "";
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  };

  // derive display first name when user is present
  const displayFirstName = user
    ? formatFirstName(user.displayName ?? user.email ?? "")
    : "";

  return (
    <>
      <MaxWidthContainer className="py-4">
        <div className="flex items-center gap-4 relative">
          {/* Logo */}
          <div className="shrink-0 relative w-32 h-12">
            <img
              src="/logo.jpeg"
              alt="Brand logo"
              className="w-32 absolute top-0 left-0 object-contain"
            />
          </div>

          {/* Location (hidden on very small screens) */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
            <LocationDropdown
              addresses={addresses}
              onAddAddress={() => {
                // clear any previous draft and open the centralized AddressModal
                setAddressDraft(null);
                setAddressToEdit(null);
                setAddressModalOpen(true);
              }}
            />
          </div>

          {/* Search: full on sm+, icon-only on xs */}
          <div className="flex-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // always navigate to shop page with search query on submit
                const q = query.trim();
                const target = q
                  ? `/shop?search=${encodeURIComponent(q)}`
                  : `/shop`;
                window.location.href = target;
              }}
              className="relative"
              role="search"
              aria-label="Site search"
            >
              {/* full search on sm+ */}
              <div className="hidden sm:flex flex-1 items-center bg-gray-100 rounded-md overflow-visible">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="search"
                    placeholder="Search products, categories..."
                    aria-label="Search products"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setOpen(e.target.value.trim().length >= 2);
                    }}
                    onFocus={() => setOpen(query.trim().length >= 2)}
                    onKeyDown={onKeyDown}
                    className="w-full px-3 py-2 text-sm bg-transparent outline-none rounded-l-md"
                  />

                  {/* results dropdown */}
                  {open && results.length > 0 && (
                    <ul
                      ref={listRef}
                      role="listbox"
                      aria-label="Search results"
                      className="absolute z-50 left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      {results.map((p, i) => (
                        <li
                          key={p.id}
                          role="option"
                          aria-selected={activeIndex === i}
                          onMouseEnter={() => setActiveIndex(i)}
                          onMouseLeave={() => setActiveIndex(-1)}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-secondary/5 ${
                            activeIndex === i ? "bg-secondary/5" : ""
                          }`}
                          onClick={() =>
                            (window.location.href = `/shop/${p.id}`)
                          }
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-md shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-foreground truncate">
                              {highlight(p.name)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.category} • ₹{p.price}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.rating}★
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  aria-label="Search"
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-r-md"
                >
                  <img
                    src="https://img.icons8.com/?size=48&id=59878&format=png&color=000000"
                    alt="Search"
                    className="h-5 w-5 object-contain"
                  />
                </button>
                {/* {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-2 bg-transparent hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              )} */}
              </div>

              {/* compact search for xs screens */}
              <button
                type="button"
                aria-label="Open search"
                className="sm:hidden p-2 rounded-md bg-gray-100"
                onClick={() => {
                  // small-screen behavior: go to shop with empty query (or focus a dedicated search UI)
                  const q = query.trim();
                  const target = q
                    ? `/shop?search=${encodeURIComponent(q)}`
                    : `/shop`;
                  window.location.href = target;
                }}
              >
                <img
                  src="https://img.icons8.com/?size=48&id=59878&format=png&color=000000"
                  alt="Search"
                  className="h-5 w-5 object-contain"
                />
              </button>
            </form>
          </div>

          {/* Actions */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Right Section - Cart, Wishlist, Auth */}
              <div className="hidden md:flex items-center gap-4">
                {/* Auth Section */}
                {isLoadingUser ? (
                  <div className="w-20 h-9 bg-secondary rounded animate-pulse" />
                ) : !user ? (
                  <Button onClick={() => setIsAuthModalOpen(true)} size="sm">
                    Sign In
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{displayFirstName}</p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t py-4 space-y-4">
                <Link
                  href="/"
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  About
                </Link>

                <div className="border-t pt-4 space-y-3">
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm font-medium">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {isLoadingUser ? (
                    <div className="w-full h-9 bg-secondary rounded animate-pulse" />
                  ) : !user ? (
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm p-2 bg-secondary rounded">
                        <p className="font-medium">{displayFirstName}</p>
                        <p className="text-xs text-muted-foreground">
                          Signed in
                        </p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 transition rounded-md"
            >
              <ShoppingCartIcon />
              {cartCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 transition rounded-md"
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* separator line */}
      </MaxWidthContainer>
      {/* Auth Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => {
          setAddressModalOpen(false);
          setAddressToEdit(null);
          setAddressDraft(null);
        }}
        address={addressToEdit}
        initialData={addressDraft ?? undefined}
        onSaved={async () => {
          setAddressModalOpen(false);
          setAddressToEdit(null);
          setAddressDraft(null);
          // refresh addresses after save
          try {
            const {
              data: { user: supaUser },
            } = await supabase.auth.getUser();
            await fetchAddresses(supaUser?.id ?? null);
          } catch (e) {
            console.error("Failed to refresh addresses after save:", e);
          }
        }}
        onDeleted={async () => {
          setAddressModalOpen(false);
          setAddressToEdit(null);
          setAddressDraft(null);
          // refresh addresses after delete
          try {
            const {
              data: { user: supaUser },
            } = await supabase.auth.getUser();
            await fetchAddresses(supaUser?.id ?? null);
          } catch (e) {
            console.error("Failed to refresh addresses after delete:", e);
          }
        }}
        onRequireAuth={(draft) => {
          // save draft, close address modal, open auth modal and remember to reopen address modal after auth
          setAddressDraft(draft ?? null);
          setAddressModalOpen(false);
          setAddressToEdit(null);
          setIsAuthModalOpen(true);
          setReopenAddressAfterAuth(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Navbar;
