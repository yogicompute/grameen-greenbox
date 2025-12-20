import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Schema:
// wishlist: id (bigint), user_id (bigint or uuid), product_id (bigint), added_at

function getUserIdFromRequest(request: Request): string | null {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  return userId && userId.trim() !== "" ? userId : null;
}

// GET /api/wishlist?userId=...
// List all wishlist items for a user
export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid userId in query" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select(
        `
        id,
        user_id,
        product_id,
        added_at,
        product:product (
          name,
          price,
          images
        )
      `
      )
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Supabase GET wishlist error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to fetch wishlist",
        },
        { status: 500 }
      );
    }

    const normalizedItems = (data ?? []).map((item: any) => {
      const product = item.product ?? {};
      return {
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        added_at: item.added_at,
        product_name: product.name ?? null,
        price: product.price ?? null,
        image_url:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : null,
      };
    });

    return NextResponse.json({ success: true, items: normalizedItems });
  } catch (err) {
    console.error("Unexpected GET wishlist error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist?userId=...
// Body: { productId }
// Adds a product to the user's wishlist (idempotent via unique constraint)
export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid userId in query" },
      { status: 400 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { productId } = body ?? {};

  if (!productId) {
    return NextResponse.json(
      { success: false, error: "productId is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .upsert(
        { user_id: userId, product_id: productId },
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase POST wishlist error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to add to wishlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    console.error("Unexpected POST wishlist error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist?userId=...
// Body options:
// - { productId } -> remove that product from wishlist
// - { clearAll: true } -> clear entire wishlist for user
export async function DELETE(request: Request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid userId in query" },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await request.json().catch(() => ({}));
  } catch {
    body = {};
  }

  const { productId, clearAll } = body ?? {};

  if (!clearAll && !productId) {
    return NextResponse.json(
      { success: false, error: "Provide productId or clearAll: true" },
      { status: 400 }
    );
  }

  try {
    let query = supabase.from("wishlist").delete().eq("user_id", userId);

    if (!clearAll && productId) {
      query = query.eq("product_id", productId);
    }

    const { error } = await query;

    if (error) {
      console.error("Supabase DELETE wishlist error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to delete wishlist item(s)",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected DELETE wishlist error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete wishlist item(s)" },
      { status: 500 }
    );
  }
}
