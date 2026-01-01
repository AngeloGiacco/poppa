import { Public_Sans } from "next/font/google";

import "./style.css";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import type { Metadata } from "next";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poppa",
  description: "AI voice-only language tutoring with Poppa",
};

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={publicSans.className}>
      <ProtectedRoute>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ProtectedRoute>
    </div>
  );
}
