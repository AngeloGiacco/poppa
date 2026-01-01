"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface SessionControlsProps {
  onDisconnect: () => Promise<void>;
}

export function SessionControls({ onDisconnect }: SessionControlsProps) {
  const t = useTranslations("Chat.SessionControls");

  return (
    <div className="flex flex-row gap-2">
      <Button variant="destructive" onClick={onDisconnect}>
        {t("disconnect")}
      </Button>
    </div>
  );
}
