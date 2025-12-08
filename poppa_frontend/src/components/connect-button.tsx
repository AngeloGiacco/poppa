"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Mic } from "lucide-react";
import { useTranslations } from "next-intl";

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
      className="text-sm font-semibold bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full transition-colors duration-300 px-6 py-2"
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
