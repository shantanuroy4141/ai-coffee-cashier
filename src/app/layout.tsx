import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegean Brew - AI Coffee Cashier",
  description: "AI-powered voice ordering for your favorite coffee shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
