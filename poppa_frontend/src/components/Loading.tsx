"use client";

import React from "react";

import Image from "next/image";

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      <div className="animate-bounce">
        <Image src="/logo.svg" alt="Loading" width={120} height={120} className="animate-pulse" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-[#8B4513]">Loading...</h2>
    </div>
  );
}
