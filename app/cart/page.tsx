import type { Metadata } from "next"
import CartPage from "./cart-page"

export const metadata: Metadata = {
  title: "Cart | Grameen GreenBox",
}

export default function Page() {
  return <CartPage />
}
