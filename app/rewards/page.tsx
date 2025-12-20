import type { Metadata } from "next";
import RewardsPage from "./rewards-page";

export const metadata: Metadata = {
	title: "Rewards | Grameen GreenBox",
};

export default function Page() {
	return <RewardsPage />;
}

