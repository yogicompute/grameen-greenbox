"use client";

import { useEffect, useState } from "react";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Package, Clock, CheckCircle2 } from "lucide-react";

type Order = {
	id: string;
	created_at: string;
	status: string;
	total_amount: number;
	item_count?: number | null;
};

export default function OrdersPage() {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadOrders = async () => {
			try {
				setError(null);
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user || !isMounted) {
					setLoading(false);
					return;
				}

				// Adjusted to your schema with order_items
				const { data, error } = await supabase
					.from("orders")
					.select("id, created_at, status, total_amount, order_items(count)")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false });

				if (error) throw error;
				if (!isMounted) return;

				setOrders(
					(data ?? []).map((row: any) => ({
						id: row.id,
						created_at: row.created_at,
						status: row.status,
						total_amount: row.total_amount,
						item_count: row.order_items?.[0]?.count ?? 0,
					}))
				);
			} catch (err: any) {
				console.error("Failed to load orders:", err);
				if (isMounted) setError("Could not load your orders. Please try again.");
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadOrders();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<MaxWidthContainer className="py-8">
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Package className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-base font-semibold">
									My Orders
								</CardTitle>
								<CardDescription>
									Track your recent purchases and their status.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-3">
								<div className="h-4 w-40 rounded bg-muted animate-pulse" />
								<div className="h-4 w-full rounded bg-muted animate-pulse" />
								<div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
							</div>
						) : error ? (
							<p className="text-sm text-destructive">{error}</p>
						) : orders.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								You don&apos;t have any orders yet. Start shopping to see your
									order history here.
							</p>
						) : (
							<ul className="space-y-3 text-sm">
								{orders.map((order) => {
									const created = new Date(order.created_at);
									const dateLabel = created.toLocaleDateString(undefined, {
										day: "numeric",
										month: "short",
										year: "numeric",
									});

									const statusLabel = order.status || "processing";

									return (
										<li
											key={order.id}
											className="flex items-center justify-between rounded-lg border bg-card px-3 py-3 shadow-sm"
										>
											<div>
												<p className="font-medium">
													Order #{String(order.id).slice(0, 8)}
												</p>
												<p className="text-xs text-muted-foreground">
													{dateLabel} • {order.item_count ?? 0} items
												</p>
											</div>
											<div className="flex flex-col items-end gap-1">
												<span className="text-sm font-semibold">
													₹{order.total_amount.toFixed(2)}
												</span>
												<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
													{statusLabel.toLowerCase().includes("delivered") ? (
														<CheckCircle2 className="h-3 w-3" />
													) : (
														<Clock className="h-3 w-3" />
													)}
													<span className="capitalize">{statusLabel}</span>
												</span>
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>
		</MaxWidthContainer>
	);
}
