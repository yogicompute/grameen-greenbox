import type { Metadata } from "next";
import ProfilePage from "./profile-page";

export const metadata: Metadata = {
	title: "Profile | Grameen GreenBox",
};

export default function Page() {
	return <ProfilePage />;
}

