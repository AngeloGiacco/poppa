import type { Metadata } from "next";
import "./style.css";
import { PlaygroundStateProvider } from "@/hooks/use-playground-state";
import { ConnectionProvider } from "@/hooks/use-connection";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Public_Sans } from "next/font/google";
import ProtectedRoute from '@/components/ProtectedRoute';

// Configure the Public Sans font
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

import "@livekit/components-styles";

export const metadata: Metadata = {
  title: 'Poppa',
  description: 'AI voice-only language tutoring with Poppa',
};

export default function LessonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <ProtectedRoute>
          <PlaygroundStateProvider>
            <ConnectionProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ConnectionProvider>
          </PlaygroundStateProvider>
        </ProtectedRoute>
      </body>
    </html>
  );
}
