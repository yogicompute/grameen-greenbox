import type { Metadata } from "next";
import ProductPage from "./product-page-client";

export const metadata: Metadata = {
  title: "Product Details | Grameen GreenBox",
};

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  // console.log(`Product id: ${params.productId}`);
  const {productId} = await params;
  return <ProductPage productId={productId} />;
}
