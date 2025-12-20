"use client";

import MaxWidthContainer from "@/components/MaxWidthContainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
	return (
		<MaxWidthContainer className="py-8">
			<div className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Contact us
						</CardTitle>
						<CardDescription>
							Have a question about an order, product, or delivery? Send us a
							message and we&apos;ll get back to you.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1">
									<label className="text-sm font-medium" htmlFor="name">
										Name
									</label>
									<Input
										id="name"
										type="text"
										placeholder="Your full name"
										required
									/>
								</div>
								<div className="space-y-1">
									<label className="text-sm font-medium" htmlFor="email">
										Email
									</label>
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										required
									/>
								</div>
							</div>
							<div className="space-y-1">
								<label className="text-sm font-medium" htmlFor="subject">
									Subject
								</label>
								<Input
									id="subject"
									type="text"
									placeholder="How can we help?"
									required
								/>
							</div>
							<div className="space-y-1">
								<label className="text-sm font-medium" htmlFor="message">
									Message
								</label>
								<Textarea
									id="message"
									placeholder="Share as many details as possible so we can assist you quickly."
									rows={4}
									required
								/>
							</div>
							<Button type="submit" className="w-full sm:w-auto">
								Send message
							</Button>
							<p className="text-xs text-muted-foreground">
								We usually reply within a few hours during working days.
							</p>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Reach us directly
						</CardTitle>
						<CardDescription>
							Prefer talking to a human? Use any of these options.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-primary" />
							<span>support@grameengreenbox.com</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone className="h-4 w-4 text-primary" />
							<span>+91-00000-00000</span>
						</div>
						<div className="flex items-start gap-2">
							<MapPin className="mt-0.5 h-4 w-4 text-primary" />
							<span>
								Grameen GreenBox HQ
								<br />
								Somewhere in India
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</MaxWidthContainer>
	);
}
