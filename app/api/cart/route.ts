import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Schema (from Supabase):
// cart:       id (bigint), user_id (bigint, unique), created_at, updated_at
// cart_items: id (bigint), cart_id (bigint -> cart.id), product_id (bigint -> product.id), quantity (int), added_at

// Helper to read userId from query string
function getUserIdFromRequest(request: Request): string | null {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	return userId && userId.trim() !== "" ? userId : null;
}

// GET /api/cart?userId=...
// List all cart items for a user
export async function GET(request: Request) {
	const userId = getUserIdFromRequest(request);

	if (!userId) {
		return NextResponse.json(
			{ success: false, error: "Missing or invalid userId in query" },
			{ status: 400 }
		);
	}

	try {
		// Find the user's cart
		const { data: cart, error: cartError } = await supabase
			.from("cart")
			.select("id")
			.eq("user_id", userId)
			.maybeSingle();

		if (cartError && cartError.code !== "PGRST116") {
			console.error("Supabase GET cart fetch cart error:", cartError);
			return NextResponse.json(
				{ success: false, error: cartError.message || "Failed to fetch cart" },
				{ status: 500 }
			);
		}

		if (!cart) {
			// No cart yet for this user, return empty list
			return NextResponse.json({ success: true, items: [] });
		}

		const { data, error } = await supabase
			.from("cart_items")
			.select(
				`
					id,
					cart_id,
					product_id,
					quantity,
					added_at,
					product:product (
						name,
						price,
						images
					)
				`
			)
			.eq("cart_id", cart.id)
			.order("added_at", { ascending: true });

		if (error) {
			console.error("Supabase GET cart error:", error);
			return NextResponse.json(
				{ success: false, error: error.message || "Failed to fetch cart" },
				{ status: 500 }
			);
		}

		// Normalize product details into flat fields for the client
		const normalizedItems = (data ?? []).map((item: any) => {
			const product = item.product ?? {};
			return {
				id: item.id,
				cart_id: item.cart_id,
				product_id: item.product_id,
				quantity: item.quantity,
				added_at: item.added_at,
				product_name: product.name ?? null,
				price: product.price ?? null,
				image_url: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null,
			};
		});

		return NextResponse.json({ success: true, items: normalizedItems });
	} catch (err) {
		console.error("Unexpected GET cart error:", err);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch cart" },
			{ status: 500 }
		);
	}
}

// POST /api/cart?userId=...
// Body: { productId, quantity }
// Creates a new cart item, or if one already exists for that product/user, increments quantity
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

	const { productId, quantity } = body ?? {};

	if (!productId || typeof quantity !== "number" || quantity <= 0) {
		return NextResponse.json(
			{ success: false, error: "productId and positive quantity are required" },
			{ status: 400 }
		);
	}

	try {
		// Ensure there is a cart row for this user (one cart per user)
		const { data: cart, error: cartError } = await supabase
			.from("cart")
			.upsert({ user_id: userId }, { onConflict: "user_id" })
			.select("id")
			.single();

		if (cartError) {
			console.error("Supabase POST cart upsert error:", cartError);
			return NextResponse.json(
				{ success: false, error: cartError.message || "Failed to add to cart" },
				{ status: 500 }
			);
		}

		// Check if item already exists in cart_items for this cart
		const { data: existing, error: fetchError } = await supabase
			.from("cart_items")
			.select("id, quantity")
			.eq("cart_id", cart.id)
			.eq("product_id", productId)
			.maybeSingle();

		if (fetchError && fetchError.code !== "PGRST116") {
			// PGRST116 = no rows, treat as non-fatal
			console.error("Supabase POST cart_items fetch error:", fetchError);
			return NextResponse.json(
				{ success: false, error: fetchError.message || "Failed to add to cart" },
				{ status: 500 }
			);
		}

		if (existing) {
			const newQuantity = existing.quantity + quantity;
			const { data, error } = await supabase
				.from("cart_items")
				.update({ quantity: newQuantity })
				.eq("id", existing.id)
				.select()
				.single();

			if (error) {
				console.error("Supabase POST cart_items update error:", error);
				return NextResponse.json(
					{ success: false, error: error.message || "Failed to update cart item" },
					{ status: 500 }
				);
			}

			return NextResponse.json({ success: true, item: data });
		}

		// Insert new item into cart_items
		const { data, error } = await supabase
			.from("cart_items")
			.insert({
				cart_id: cart.id,
				product_id: productId,
				quantity,
			})
			.select()
			.single();

		if (error) {
			console.error("Supabase POST cart_items insert error:", error);
			return NextResponse.json(
				{ success: false, error: error.message || "Failed to add to cart" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, item: data });
	} catch (err) {
		console.error("Unexpected POST cart error:", err);
		return NextResponse.json(
			{ success: false, error: "Failed to add to cart" },
			{ status: 500 }
		);
	}
}

// PUT /api/cart?userId=...
// Body: { itemId?, productId?, quantity }
// Updates quantity for a specific cart item (by id or by productId for that user)
export async function PUT(request: Request) {
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

	const { itemId, productId, quantity } = body ?? {};

	if (typeof quantity !== "number" || quantity <= 0) {
		return NextResponse.json(
			{ success: false, error: "Positive quantity is required" },
			{ status: 400 }
		);
	}

	if (!itemId && !productId) {
		return NextResponse.json(
			{ success: false, error: "itemId or productId is required" },
			{ status: 400 }
		);
	}

	try {
		// Find the user's cart first
		const { data: cart, error: cartError } = await supabase
			.from("cart")
			.select("id")
			.eq("user_id", userId)
			.maybeSingle();

		if (cartError && cartError.code !== "PGRST116") {
			console.error("Supabase PUT cart fetch cart error:", cartError);
			return NextResponse.json(
				{ success: false, error: cartError.message || "Failed to update cart item" },
				{ status: 500 }
			);
		}

		if (!cart) {
			return NextResponse.json(
				{ success: false, error: "Cart not found" },
				{ status: 404 }
			);
		}

		let query = supabase
			.from("cart_items")
			.update({ quantity })
			.eq("cart_id", cart.id);

		if (itemId) {
			query = query.eq("id", itemId);
		} else if (productId) {
			query = query.eq("product_id", productId);
		}

		const { data, error } = await query.select().maybeSingle();

		if (error) {
			console.error("Supabase PUT cart update error:", error);
			return NextResponse.json(
				{ success: false, error: error.message || "Failed to update cart item" },
				{ status: 500 }
			);
		}

		if (!data) {
			return NextResponse.json(
				{ success: false, error: "Cart item not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, item: data });
	} catch (err) {
		console.error("Unexpected PUT cart error:", err);
		return NextResponse.json(
			{ success: false, error: "Failed to update cart item" },
			{ status: 500 }
		);
	}
}

// DELETE /api/cart?userId=...
// Body options:
// - { itemId } -> delete a single item
// - { productId } -> delete specific product for user
// - { clearAll: true } -> clear entire cart for user
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
		// Body may be empty for clear-all via query, so catch parsing failure
		body = await request.json().catch(() => ({}));
	} catch {
		body = {};
	}

	const { itemId, productId, clearAll } = body ?? {};

	if (!clearAll && !itemId && !productId) {
		return NextResponse.json(
			{ success: false, error: "Provide itemId, productId, or clearAll: true" },
			{ status: 400 }
		);
	}

	try {
		// Find the user's cart
		const { data: cart, error: cartError } = await supabase
			.from("cart")
			.select("id")
			.eq("user_id", userId)
			.maybeSingle();

		if (cartError && cartError.code !== "PGRST116") {
			console.error("Supabase DELETE cart fetch cart error:", cartError);
			return NextResponse.json(
				{ success: false, error: cartError.message || "Failed to delete cart item(s)" },
				{ status: 500 }
			);
		}

		if (!cart) {
			// Nothing to delete
			return NextResponse.json({ success: true });
		}

		let query = supabase.from("cart_items").delete().eq("cart_id", cart.id);

		if (!clearAll) {
			if (itemId) {
				query = query.eq("id", itemId);
			} else if (productId) {
				query = query.eq("product_id", productId);
			}
		}

		const { error } = await query;

		if (error) {
			console.error("Supabase DELETE cart error:", error);
			return NextResponse.json(
				{ success: false, error: error.message || "Failed to delete cart item(s)" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Unexpected DELETE cart error:", err);
		return NextResponse.json(
			{ success: false, error: "Failed to delete cart item(s)" },
			{ status: 500 }
		);
	}
}

