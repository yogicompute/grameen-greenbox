"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, User2 } from "lucide-react";

type Address = {
	id: string;
	full_name?: string | null;
	line1?: string | null;
	line2?: string | null;
	city?: string | null;
	state?: string | null;
	postal_code?: string | null;
	phone?: string | null;
	is_default?: boolean | null;
};

export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [displayName, setDisplayName] = useState<string | null>(null);
	const [addresses, setAddresses] = useState<Address[]>([]);

	useEffect(() => {
		let isMounted = true;

		const loadProfile = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user || !isMounted) {
					setLoading(false);
					return;
				}

				const meta = (user.user_metadata ?? {}) as any;
				const nameFromMeta =
					meta?.display_name || meta?.full_name || user.email?.split("@")[0];

				setUserEmail(user.email ?? null);
				setDisplayName(nameFromMeta ?? null);

				const { data, error } = await supabase
					.from("addresses")
					.select("*")
					.eq("user_id", user.id)
					.order("is_default", { ascending: false });

				if (error) throw error;
				if (!isMounted) return;

				setAddresses((data as Address[]) ?? []);
			} catch (err) {
				console.error("Failed to load profile:", err);
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		loadProfile();

		return () => {
			isMounted = false;
		};
	}, []);

	const firstName = displayName
		? displayName.trim().split(/\s+|[._-]/)[0]
		: userEmail
		? userEmail.split("@")[0]
		: "Guest";

	return (
		<MaxWidthContainer className="py-8">
			<div className="flex flex-col gap-6 md:flex-row">
				{/* Left: user summary */}
				<div className="w-full md:w-1/3 space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
									<User2 className="h-6 w-6" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										{firstName}
									</CardTitle>
									<CardDescription>Profile overview</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="h-4 w-4" />
								<span>{userEmail ?? "Not signed in"}</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-3 text-[11px] font-medium text-emerald-700">
									{addresses.length > 0
										? `${addresses.length} saved address${
												addresses.length > 1 ? "es" : ""
										}`
										: "No saved addresses yet"}
								</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-3 text-[11px] font-medium text-amber-700">
									Rewards coming soon
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Quick actions</CardTitle>
							<CardDescription>
								Jump to the most common things you do.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-2">
							<Button asChild variant="outline" size="sm">
								<a href="/orders">View my orders</a>
							</Button>
							<Button asChild variant="outline" size="sm">
								<a href="/wishlist">Go to wishlist</a>
							</Button>
							<Button asChild variant="outline" size="sm">
								<a href="/rewards">Check rewards</a>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Right: addresses & details */}
				<div className="w-full md:w-2/3 space-y-4">
					<Card>
						<CardHeader className="flex items-center justify-between">
							<div>
								<CardTitle className="text-base">Saved addresses</CardTitle>
								<CardDescription>
									These addresses are used for deliveries and orders.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="space-y-3">
									<div className="h-4 w-40 rounded bg-muted animate-pulse" />
									<div className="h-4 w-full rounded bg-muted animate-pulse" />
									<div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
								</div>
							) : addresses.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									You don&apos;t have any saved addresses yet. Add one from the
										address selector in the navbar when placing an order.
								</p>
							) : (
								<ul className="space-y-3">
									{addresses.map((addr) => (
										<li
											key={addr.id}
											className="flex items-start justify-between rounded-lg border bg-card px-3 py-3 text-sm shadow-sm"
										>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-primary" />
													<span className="font-medium">
														{addr.full_name || firstName}
													</span>
													{addr.is_default && (
														<span className="inline-flex items-center rounded-full bg-emerald-50 px-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
															Default
														</span>
													)}
												</div>
												<div className="text-xs text-muted-foreground space-y-0.5">
													<p>
														{addr.line1}
														{addr.line2 ? `, ${addr.line2}` : ""}
													</p>
													<p>
														{[addr.city, addr.state, addr.postal_code]
															.filter(Boolean)
															.join(", ")}
													</p>
													{addr.phone && <p>Phone: {addr.phone}</p>}
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Account details</CardTitle>
							<CardDescription>
								Basic information about your Grameen GreenBox account.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
							<div className="space-y-0.5">
								<p className="text-xs uppercase text-muted-foreground">
									Name
								</p>
								<p className="font-medium">{displayName ?? firstName}</p>
							</div>
							<div className="space-y-0.5">
								<p className="text-xs uppercase text-muted-foreground">
									Email
								</p>
								<p className="font-medium">{userEmail ?? "Not available"}</p>
							</div>
							<div className="space-y-0.5">
								<p className="text-xs uppercase text-muted-foreground">
									Member since
								</p>
								<p className="font-medium">GreenBox shopper</p>
							</div>
							<div className="space-y-0.5">
								<p className="text-xs uppercase text-muted-foreground">
									Communication
								</p>
								<p className="font-medium">Order updates & offers</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</MaxWidthContainer>
	);
}
