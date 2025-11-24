import { NextResponse } from "next/server";
import  ALL_PRODUCTS from "@/lib/products.json";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "name";

    let filteredProducts = [...ALL_PRODUCTS];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term (searches name)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p) =>
        p.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    if (sortBy === "price-asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return NextResponse.json({
      success: true,
      count: filteredProducts.length,
      products: filteredProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
