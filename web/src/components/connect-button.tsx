"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useConnection } from "@/hooks/use-connection";
import { Loader2, Mic } from "lucide-react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useTranslations } from "next-intl";

export function ConnectButton() {
  const { connect, disconnect, shouldConnect } = useConnection();
  const [connecting, setConnecting] = useState<boolean>(false);
  const { pgState } = usePlaygroundState();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [initiateConnectionFlag, setInitiateConnectionFlag] = useState(false);
  const t = useTranslations("Chat.ConnectButton");

  const handleConnectionToggle = async () => {
    if (shouldConnect) {
      await disconnect();
    } else {
      if (!pgState.openaiAPIKey) {
        setShowAuthDialog(true);
      } else {
        await initiateConnection();
      }
    }
  };

  const initiateConnection = useCallback(async () => {
    setConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(false);
    }
  }, [connect]);

  const handleAuthComplete = () => {
    setShowAuthDialog(false);
    setInitiateConnectionFlag(true);
  };

  useEffect(() => {
    if (initiateConnectionFlag && pgState.openaiAPIKey) {
      initiateConnection();
      setInitiateConnectionFlag(false);
    }
  }, [initiateConnectionFlag, initiateConnection, pgState.openaiAPIKey]);

  return (
    <>
      <Button
        onClick={handleConnectionToggle}
        disabled={connecting || shouldConnect}
        className="text-sm font-semibold bg-[#8B4513] hover:bg-[#6D3611] text-white rounded-full transition-colors duration-300 px-6 py-2"
      >
        {connecting || shouldConnect ? (
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
    </>
  );
}
