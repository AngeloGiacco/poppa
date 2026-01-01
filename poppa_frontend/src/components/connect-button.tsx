"use client";

import { Loader2, Mic } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
  onConnect: () => Promise<void>;
  isConnecting: boolean;
}

export function ConnectButton({ onConnect, isConnecting }: ConnectButtonProps) {
  const t = useTranslations("Chat.ConnectButton");

  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className="rounded-full bg-[#8B4513] px-6 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6D3611]"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("connecting")}
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          {t("connect")}
        </>
      )}
    </Button>
  );
}
