"use client";

import { useState } from "react";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star, ShoppingBag } from "lucide-react";

type RewardSummary = {
	points: number;
	tier: "Bronze" | "Silver" | "Gold" | "Platinum";
};

type RewardActivity = {
	id: string;
	label: string;
	date: string;
	points: number;
};

const MOCK_SUMMARY: RewardSummary = {
	points: 0,
	tier: "Bronze",
};

const MOCK_ACTIVITY: RewardActivity[] = [];

export default function RewardsPage() {
	const [summary] = useState<RewardSummary>(MOCK_SUMMARY);
	const [activity] = useState<RewardActivity[]>(MOCK_ACTIVITY);

	const tierColor =
		summary.tier === "Platinum"
			? "bg-slate-900 text-slate-50"
			: summary.tier === "Gold"
			? "bg-amber-500 text-amber-950"
			: summary.tier === "Silver"
			? "bg-slate-200 text-slate-900"
			: "bg-amber-100 text-amber-900";

	return (
		<MaxWidthContainer className="py-8">
			<div className="flex flex-col gap-6 md:flex-row">
				{/* Left: summary & actions */}
				<div className="w-full md:w-1/3 space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Gift className="h-6 w-6" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										Rewards
									</CardTitle>
									<CardDescription>
										Earn points every time you shop.
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-xs uppercase text-muted-foreground">
									Available points
								</p>
								<p className="text-3xl font-semibold tracking-tight">
									{summary.points}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-xs uppercase text-muted-foreground">
									Tier
								</p>
								<span
									className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tierColor}`}
								>
									<Star className="h-3 w-3" />
									{summary.tier} member
								</span>
							</div>

							<Button asChild size="sm" className="w-full">
								<a href="/shop" className="flex items-center justify-center gap-1">
									<ShoppingBag className="h-4 w-4" />
									Shop to earn more
								</a>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-sm">How it works</CardTitle>
							<CardDescription>
								Simple rules that reward your everyday groceries.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2 text-sm text-muted-foreground">
							<p>• Earn 1 point for every ₹100 you spend.</p>
							<p>• Unlock higher tiers for bonus multipliers.</p>
							<p>• Redeem points for discounts on future orders.</p>
						</CardContent>
					</Card>
				</div>

				{/* Right: activity & tiers */}
				<div className="w-full md:w-2/3 space-y-4">
					<Card>
						<CardHeader className="flex items-center justify-between">
							<div>
								<CardTitle className="text-base">Recent activity</CardTitle>
								<CardDescription>
									A quick look at how you earned your points.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							{activity.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									You don&apos;t have any reward activity yet. Place your first
										order to start earning.
								</p>
							) : (
								<ul className="space-y-3 text-sm">
									{activity.map((item) => (
										<li
											key={item.id}
											className="flex items-center justify-between rounded-lg border bg-card px-3 py-3 shadow-sm"
										>
											<div>
												<p className="font-medium">{item.label}</p>
												<p className="text-xs text-muted-foreground">
													{item.date}
												</p>
											</div>
											<span className="text-xs font-semibold text-emerald-700">
												+{item.points} pts
											</span>
										</li>
									))}
								</ul>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Tiers</CardTitle>
							<CardDescription>
								See what you unlock as you move up.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
							<div className="space-y-1 rounded-lg border bg-card px-3 py-3">
								<p className="text-xs font-semibold uppercase text-muted-foreground">
									Bronze
								</p>
								<p className="text-xs text-muted-foreground">
									0–499 points. Basic benefits and welcome offers.
								</p>
							</div>
							<div className="space-y-1 rounded-lg border bg-card px-3 py-3">
								<p className="text-xs font-semibold uppercase text-muted-foreground">
									Silver
								</p>
								<p className="text-xs text-muted-foreground">
									500–1499 points. Better offers and early access.
								</p>
							</div>
							<div className="space-y-1 rounded-lg border bg-card px-3 py-3">
								<p className="text-xs font-semibold uppercase text-muted-foreground">
									Gold
								</p>
								<p className="text-xs text-muted-foreground">
									1500–2999 points. Priority support and bonus days.
								</p>
							</div>
							<div className="space-y-1 rounded-lg border bg-card px-3 py-3">
								<p className="text-xs font-semibold uppercase text-muted-foreground">
									Platinum
								</p>
								<p className="text-xs text-muted-foreground">
									3000+ points. Best offers and exclusive previews.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</MaxWidthContainer>
	);
}
