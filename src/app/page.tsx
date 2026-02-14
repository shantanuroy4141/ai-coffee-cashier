"use client";

import Link from "next/link";
import { useState } from "react";
import { useStaffAuth } from "@/lib/staffAuth";
import StaffCodePrompt from "@/components/StaffCodePrompt";

export default function Home() {
  const { hasBaristaAccess, hasOwnerAccess } = useStaffAuth();
  const [unlockTarget, setUnlockTarget] = useState<"barista" | "owner" | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-santorini-50 via-white to-cream flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-santorini-400 to-santorini-600 shadow-xl shadow-santorini-200 mb-6">
            <span className="text-5xl">&#9749;</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-santorini-900 mb-3">
            Aegean Brew
          </h1>
          <p className="text-santorini-600 text-lg">
            AI-Powered Coffee Ordering
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Link
            href="/customer"
            className="group p-6 bg-white rounded-3xl border border-santorini-100 shadow-sm hover:shadow-xl hover:border-santorini-300 transition-all hover:-translate-y-1"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-santorini-50 flex items-center justify-center group-hover:bg-santorini-100 transition-colors">
              <svg
                className="w-7 h-7 text-santorini-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="font-display text-lg font-bold text-santorini-800 mb-1">
              Customer
            </h2>
            <p className="text-sm text-santorini-600">
              Order your coffee by voice or chat
            </p>
          </Link>

          {hasBaristaAccess ? (
            <Link
              href="/barista"
              className="group p-6 bg-white rounded-3xl border border-santorini-100 shadow-sm hover:shadow-xl hover:border-santorini-300 transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-santorini-50 flex items-center justify-center group-hover:bg-santorini-100 transition-colors">
                <svg
                  className="w-7 h-7 text-santorini-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="font-display text-lg font-bold text-santorini-800 mb-1">
                Barista
              </h2>
              <p className="text-sm text-santorini-600">
                View and manage the order queue
              </p>
            </Link>
          ) : (
            <button
              onClick={() => setUnlockTarget("barista")}
              className="group p-6 bg-white rounded-3xl border border-santorini-100 shadow-sm hover:shadow-xl hover:border-santorini-300 transition-all hover:-translate-y-1 text-left w-full"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-santorini-50 flex items-center justify-center group-hover:bg-santorini-100 transition-colors relative">
                <svg
                  className="w-7 h-7 text-santorini-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-santorini-200 flex items-center justify-center text-[10px]">&#128274;</span>
              </div>
              <h2 className="font-display text-lg font-bold text-santorini-800 mb-1">
                Barista
              </h2>
              <p className="text-sm text-santorini-600">
                Enter staff code to access
              </p>
            </button>
          )}

          {hasOwnerAccess ? (
            <Link
              href="/owner"
              className="group p-6 bg-white rounded-3xl border border-santorini-100 shadow-sm hover:shadow-xl hover:border-santorini-300 transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-santorini-50 flex items-center justify-center group-hover:bg-santorini-100 transition-colors">
                <svg
                  className="w-7 h-7 text-santorini-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-lg font-bold text-santorini-800 mb-1">
                Owner
              </h2>
              <p className="text-sm text-santorini-600">
                View sales data and insights
              </p>
            </Link>
          ) : (
            <button
              onClick={() => setUnlockTarget("owner")}
              className="group p-6 bg-white rounded-3xl border border-santorini-100 shadow-sm hover:shadow-xl hover:border-santorini-300 transition-all hover:-translate-y-1 text-left w-full"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-santorini-50 flex items-center justify-center group-hover:bg-santorini-100 transition-colors relative">
                <svg
                  className="w-7 h-7 text-santorini-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-santorini-200 flex items-center justify-center text-[10px]">&#128274;</span>
              </div>
              <h2 className="font-display text-lg font-bold text-santorini-800 mb-1">
                Owner
              </h2>
              <p className="text-sm text-santorini-600">
                Enter owner code to access
              </p>
            </button>
          )}
        </div>
      </div>

      {unlockTarget && (
        <StaffCodePrompt
          target={unlockTarget}
          onSuccess={() => setUnlockTarget(null)}
        />
      )}
    </div>
  );
}
