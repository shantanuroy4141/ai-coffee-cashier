"use client";

import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";

export default function OwnerPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-hidden bg-cream">
        <Dashboard />
      </div>
    </div>
  );
}
