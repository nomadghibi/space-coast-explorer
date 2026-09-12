import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spacecoastexplorer.com"),
  title: {
    default: "Space Coast Explorer",
    template: "%s | Space Coast Explorer"
  },
  description: "Discover self-guided experiences across Florida's Space Coast.",
  openGraph: {
    title: "Space Coast Explorer",
    description: "Discover self-guided experiences across Florida's Space Coast.",
    type: "website",
    url: "/"
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
