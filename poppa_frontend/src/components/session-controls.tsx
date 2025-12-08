"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
