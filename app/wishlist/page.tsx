import type { Metadata } from "next"
import WishlistPage from "./wishlist-page"

export const metadata: Metadata = {
  title: "Wishlist | Grameen GreenBox",
}

export default function Page() {
  return <WishlistPage />
}
