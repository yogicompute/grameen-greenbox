import type { Metadata } from "next"
import { Suspense } from "react"
import ShopPage from "./shop-page-client"

export const metadata: Metadata = {
  title: "Shop | Grameen GreenBox",
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShopPage />
    </Suspense>
  )
}
