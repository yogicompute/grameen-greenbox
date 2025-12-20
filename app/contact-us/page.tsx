import type { Metadata } from "next";
import ContactUsPage from "./contact-us-page";

export const metadata: Metadata = {
	title: "Contact Us | Grameen GreenBox",
};

export default function Page() {
	return <ContactUsPage />;
}

