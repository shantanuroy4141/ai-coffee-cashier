"use client";

import { useState } from "react";
import { useStaffAuth } from "@/lib/staffAuth";
import { useRouter } from "next/navigation";

type UnlockTarget = "barista" | "owner";

export default function StaffCodePrompt({
  target,
  onSuccess,
  compact = false,
}: {
  target: UnlockTarget;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { checkCode, setLevel } = useStaffAuth();
  const router = useRouter();

  const label = target === "owner" ? "Owner" : "Barista";
  const placeholder = `Enter ${label.toLowerCase()} code`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = checkCode(code);
    if (result === null) {
      setError("Invalid code. Try again.");
      setCode("");
      return;
    }
    if (target === "owner" && result !== "owner") {
      setError("Owner code required.");
      setCode("");
      return;
    }
    setLevel(result);
    setCode("");
    if (onSuccess) {
      onSuccess();
      router.push(target === "barista" ? "/barista" : "/owner");
    } else if (target === "barista") {
      router.push("/barista");
    } else {
      router.push("/owner");
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-xl border border-greek-200 text-sm focus:outline-none focus:ring-2 focus:ring-greek-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-greek-500 text-white rounded-xl text-sm font-medium hover:bg-greek-600"
          >
            Unlock
          </button>
        </form>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full">
        <h3 className="font-display text-xl font-bold text-greek-800 mb-2">
          Staff Access
        </h3>
        <p className="text-sm text-greek-600 mb-4">
          Enter your {label.toLowerCase()} code to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-2xl border border-greek-200 text-sm focus:outline-none focus:ring-2 focus:ring-greek-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-greek-500 text-white rounded-2xl font-medium text-sm hover:bg-greek-600 transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
