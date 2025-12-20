"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MaxWidthContainer from "../MaxWidthContainer";
import ALL_PRODUCTS from "@/lib/products.json";
import { supabase } from "@/lib/supabase";
import { Button } from "./button";
import {
  Menu,
  X,
  LogOut,
  ShoppingCartIcon,
  HeartIcon,
  UserCircle2,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { AuthModal } from "../modals/auth-modal";
import { LocationDropdown } from "../location-dropdown";
import AddressModal from "../modals/address-modal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

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

    const current = searchParams?.get("search") ?? "";
    setQuery(current);

    const getUser = async () => {
      try {
        const {
          data: { user: supaUser },
        } = await supabase.auth.getUser();

        if (supaUser) {
          const meta = (supaUser.user_metadata ?? {}) as any;
          const displayName =
            meta?.display_name ||
            meta?.full_name ||
            (supaUser.email ? supaUser.email.split("@")[0] : undefined);

          setUser({ email: supaUser.email || "", displayName });

          fetchAddresses(supaUser.id).catch((e) =>
            console.error("Failed to fetch addresses:", e)
          );
          fetchCartCount(supaUser.id).catch((e: any) =>
            console.error("Failed to fetch cart count:", e)
          );
          fetchWishlistCount(supaUser.id).catch((e: any) =>
            console.error("Failed to fetch wishlist count:", e)
          );
        } else {
          setUser(null);
          setCartCount(0);
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch user:", error);
        setUser(null);
        setCartCount(0);
        setWishlistCount(0);
      } finally {
        setIsLoadingUser(false);
      }
    };

    getUser();

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
        fetchCartCount(session.user.id).catch((e: any) => {
          console.error("Failed to fetch cart count:", e);
        });
        fetchWishlistCount(session.user.id).catch((e: any) => {
          console.error("Failed to fetch wishlist count:", e);
        });
      } else {
        setUser(null);
        setAddresses([]);
        setCartCount(0);
        setWishlistCount(0);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [searchParams]);

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
      setCartCount(0);
      setWishlistCount(0);
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
      e.preventDefault();
      const q = query.trim();

      const params = new URLSearchParams(
        searchParams ? Array.from(searchParams.entries()) : []
      );

      if (q) {
        params.set("search", q);
      } else {
        params.delete("search");
      }

      const target =
        params.toString().length > 0 ? `/shop?${params.toString()}` : `/shop`;

      router.push(target);
    }
  }

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

  // fetch cart count helper
  const fetchCartCount = async (userId?: string | null) => {
    try {
      if (!userId) {
        setCartCount(0);
        return;
      }

      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) {
        setCartCount(0);
        return;
      }
      const data = await res.json().catch(() => null);
      const items = Array.isArray(data?.items) ? data.items : [];
      setCartCount(items.length);
    } catch (e: any) {
      console.error("fetchCartCount error:", e);
      setCartCount(0);
    }
  };

  const fetchWishlistCount = async (userId?: string | null) => {
    try {
      if (!userId) {
        setWishlistCount(0);
        return;
      }

      const res = await fetch(
        `/api/wishlist?userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) {
        setWishlistCount(0);
        return;
      }
      const data = await res.json().catch(() => null);
      const items = Array.isArray(data?.items) ? data.items : [];
      setWishlistCount(items.length);
    } catch (e: any) {
      console.error("fetchWishlistCount error:", e);
      setWishlistCount(0);
    }
  };

  return (
    <>
      <MaxWidthContainer className="py-4">
        <div className="flex items-center gap-4 relative">
          {/* Logo */}
          <Link href={"/"}>
            <div className="shrink-0 relative w-32 h-12">
              <img
                src="/logo.jpeg"
                alt="Brand logo"
                className="w-32 absolute top-0 left-0 object-contain"
              />
            </div>
          </Link>

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
                const q = query.trim();

                const params = new URLSearchParams(
                  searchParams ? Array.from(searchParams.entries()) : []
                );

                if (q) {
                  params.set("search", q);
                } else {
                  params.delete("search");
                }

                const target =
                  params.toString().length > 0
                    ? `/shop?${params.toString()}`
                    : `/shop`;

                router.push(target);
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
                      setOpen(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => setOpen(query.trim().length > 0)}
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

          {/* Right side: Profile, cart, more menu */}
          <div className="ml-auto flex items-center gap-3">
            {/* Desktop profile dropdown */}
            <div className="hidden md:block relative">
              {isLoadingUser ? (
                <div className="w-24 h-9 bg-secondary rounded animate-pulse" />
              ) : !user ? (
                <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  Sign In
                </Button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen((v) => !v);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 transition"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                    <span className="hidden sm:inline-block font-medium">
                      {displayFirstName || "Profile"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg z-40 text-sm">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-3 py-2 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span>Wishlists</span>
                        {wishlistCount > 0 && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/rewards"
                        className="block px-3 py-2 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Rewards
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 border-t px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Cart with label (desktop + mobile) */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition"
            >
              <div className="relative">
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-[5px] -right-[7px] h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="hidden xs:inline-block text-sm font-medium">
                Cart
              </span>
            </Link>

            {/* Three dots more menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen((v) => !v);
                  setIsProfileOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition"
                aria-haspopup="menu"
                aria-expanded={isMoreMenuOpen}
              >
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>
              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg z-40 text-sm">
                  <Link
                    href="/contact-us"
                    className="block px-3 py-2 hover:bg-gray-50"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    Contact-us
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile auth / profile trigger */}
            <div className="md:hidden">
              {isLoadingUser ? (
                <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
              ) : !user ? (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm"
                >
                  Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
                  aria-label="Open account menu"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile expanded menu (profile + wishlist + cart) */}
        {isMobileMenuOpen && user && (
          <div className="mt-3 space-y-2 rounded-md border bg-white p-3 text-sm shadow-sm md:hidden">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div>
                <p className="font-medium">{displayFirstName}</p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>

            <Link
              href="/profile"
              className="block rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link
              href="/orders"
              className="block rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Wishlists</span>
              {wishlistCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/rewards"
              className="block rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rewards
            </Link>
            <Link
              href="/contact-us"
              className="block rounded px-2 py-1 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact-us
            </Link>
          </div>
        )}

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
