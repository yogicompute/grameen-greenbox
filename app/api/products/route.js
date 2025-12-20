import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "name";

    // Build Supabase query according to `product` table schema
    // select explicit fields to avoid unexpected columns
    let query = supabase
      .from("product")
      .select(
        `id, name, category, price, images, ratings, review_count, product_description, created_at, updated_at`
      );

    if (category) {
      // match category case-insensitive (partial match)
      query = query.ilike("category", `%${category}%`);
    }

    if (search) {
      // partial match on name (case-insensitive)
      query = query.ilike("name", `%${search}%`);
    }

    // Apply sorting: use 'ratings' column per schema
    if (sortBy === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (sortBy === "rating") {
      query = query.order("ratings", { ascending: false });
    } else {
      query = query.order("name", { ascending: true });
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase products query error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      products: data ?? [],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
