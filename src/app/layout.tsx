import type { Metadata } from "next";
import NavBar from "./components/NavBar";
import { Montserrat } from "next/font/google";
import "./styles/globals.css";

const montserrat = Montserrat({ weight: ["500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PyCon HK Prize Redemption",
  description:
    "This is the prize redemption portal for PyCon HK 2025 winners. Redeem your prizes here!",
  openGraph: {
    title: "PyCon HK Prize Redemption",
    description:
      "This is the prize redemption portal for PyCon HK 2025 winners. Redeem your prizes here!",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "PyCon HK Prize Redemption",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyCon HK Prize Redemption",
    description:
      "This is the prize redemption portal for PyCon HK 2025 winners. Redeem your prizes here!",
    creator: "@pyconhk",
    site: "@pyconhk",
  },
  keywords: [
    "Python",
    "PyCon",
    "Hong Kong",
    "Conference",
    "Programming",
    "Technology",
    "2025",
    "Redeem",
    "Prizes",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en_US" className="light">
      <body className={`${montserrat.className}`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
