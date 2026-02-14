"use client";

import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import StaffCodePrompt from "@/components/StaffCodePrompt";
import { useStaffAuth } from "@/lib/staffAuth";

export default function OwnerPage() {
  const { hasOwnerAccess } = useStaffAuth();

  if (!hasOwnerAccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">&#9749;</div>
          <h2 className="font-display text-xl font-bold text-greek-800 mb-2">
            Owner Access
          </h2>
          <p className="text-sm text-greek-600 mb-6">
            Enter your owner code to view the dashboard
          </p>
          <StaffCodePrompt target="owner" compact />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-hidden bg-cream">
        <Dashboard />
      </div>
    </div>
  );
}
