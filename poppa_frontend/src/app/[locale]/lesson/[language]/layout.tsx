import "./style.css";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import type { Metadata } from "next";

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
    <div className="font-sans">
      <ProtectedRoute>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ProtectedRoute>
    </div>
  );
}
