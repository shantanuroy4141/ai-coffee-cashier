"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStaffAuth } from "@/lib/staffAuth";

const navItems = [
  { href: "/customer", label: "Customer", icon: "chat" as const, requires: "customer" as const },
  { href: "/barista", label: "Barista", icon: "queue" as const, requires: "barista" as const },
  { href: "/owner", label: "Dashboard", icon: "chart" as const, requires: "owner" as const },
];

function NavIcon({ type }: { type: string }) {
  const svgProps = { width: 20, height: 20, fill: "none" as const, stroke: "currentColor", viewBox: "0 0 24 24" };
  switch (type) {
    case "chat":
      return (
        <svg {...svgProps} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case "queue":
      return (
        <svg {...svgProps} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "chart":
      return (
        <svg {...svgProps} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navigation() {
  const pathname = usePathname();
  const { hasBaristaAccess, hasOwnerAccess } = useStaffAuth();

  const visibleItems = navItems.filter((item) => {
    if (item.requires === "customer") return true;
    if (item.requires === "barista") return hasBaristaAccess;
    if (item.requires === "owner") return hasOwnerAccess;
    return false;
  });

  return (
    <nav className="bg-white border-b border-santorini-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">&#9749;</span>
            <span className="font-display text-xl font-bold text-santorini-800">
              Aegean Brew
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-santorini-500 text-white shadow-md"
                      : "text-santorini-700 hover:bg-santorini-50"
                  }`}
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
