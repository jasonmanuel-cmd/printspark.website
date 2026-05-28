"use client";

import { useState, useEffect } from "react";

export function AgeVerification({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "gate" | "verified">(
    "loading"
  );

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce(
      (acc, c) => {
        const idx = c.indexOf("=");
        if (idx > 0) acc[c.slice(0, idx)] = c.slice(idx + 1);
        return acc;
      },
      {} as Record<string, string>
    );
    setState(cookies["age_verified"] === "true" ? "verified" : "gate");
  }, []);

  const handleVerify = () => {
    document.cookie = "age_verified=true;path=/;max-age=86400";
    setState("verified");
  };

  const handleReject = () => {
    window.location.href = "https://google.com";
  };

  if (state === "loading") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (state === "verified") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="text-center px-8 py-12 max-w-md mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        <svg
          viewBox="0 0 32 32"
          className="w-16 h-16 mx-auto mb-6 text-yellow-400 drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0L4 16h8L8 32l6-14H8l6-14L8-2z"
            fill="currentColor"
          />
        </svg>

        <h1
          className="text-4xl font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          PrintSpark
        </h1>
        <p className="text-white/70 mb-8 text-lg">
          Print Fast. Look Amazing.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-3">
          Are you 21 or older?
        </h2>
        <p className="text-white/50 mb-8 text-sm leading-relaxed">
          This site contains age-restricted content. You must be 21 or older to
          enter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleVerify}
            className="px-10 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Yes, I&apos;m 21+
          </button>
          <button
            onClick={handleReject}
            className="px-10 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 active:scale-[0.98]"
          >
            No
          </button>
        </div>

        <p className="text-white/30 text-xs mt-8">
          By entering you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
