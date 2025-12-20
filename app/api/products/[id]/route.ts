import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request, { params }: {params: Promise<{id:string}>}) {
    const {id} = await params
  try {

    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase product fetch error:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to fetch product" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    console.error("Error in product GET route:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
