import type { Metadata } from "next"
import ShopPage from "./shop-page-client"

export const metadata: Metadata = {
  title: "Shop | Grameen GreenBox",
}

export default function Page() {
  return <ShopPage />
}
