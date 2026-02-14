import type { Metadata } from "next";
import "./globals.css";
import { StaffAuthProvider } from "@/lib/staffAuth";

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
      <body className="antialiased">
        <StaffAuthProvider>{children}</StaffAuthProvider>
      </body>
    </html>
  );
}
