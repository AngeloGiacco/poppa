"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionControls } from "@/components/session-controls";
import { ConnectButton } from "./connect-button";
import { ConnectionState } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConnectionState,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react";
import { ChatControls } from "@/components/chat-controls";
import { useAgent } from "@/hooks/use-agent";
import { useConnection } from "@/hooks/use-connection";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import { useAuth } from "@/context/AuthContext";

export function Chat() {
  const connectionState = useConnectionState();
  const { audioTrack, state } = useVoiceAssistant();
  const [isChatRunning, setIsChatRunning] = useState(false);
  const { agent, displayTranscriptions } = useAgent();
  const { disconnect } = useConnection();
  const [hasSeenAgent, setHasSeenAgent] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const t = useTranslations("Chat");
  const { user } = useAuth();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isHandlingSessionEnd, setIsHandlingSessionEnd] = useState(false);

  const handleSessionEnd = useCallback(async () => {
    if (!sessionStartTime || !user || isHandlingSessionEnd) return;
    
    setIsHandlingSessionEnd(true);
    
    // Prevent multiple calls
    const currentSessionStartTime = sessionStartTime;
    setSessionStartTime(null);

    const sessionEndTime = new Date();
    const sessionDurationMinutes = Math.ceil(
      (sessionEndTime.getTime() - currentSessionStartTime.getTime()) / (1000 * 60)
    );

    // Don't save sessions shorter than 1 minute
    if (sessionDurationMinutes < 1) {
      setIsHandlingSessionEnd(false);
      return;
    }

    try {
      await Promise.all([
        supabaseBrowserClient
          .from('lesson')
          .insert({
            user: user.id,
            transcript: JSON.stringify(displayTranscriptions),
            created_at: new Date().toISOString(),
          })
          .throwOnError(),

        supabaseBrowserClient.rpc(
          'increment_credits',
          { increment_amount: -sessionDurationMinutes }
        ).throwOnError()
      ]);

    } catch (error) {
      console.error('Error saving session:', error);
      if (document.visibilityState === 'visible') {
        toast({
          title: t("errors.sessionSave.title"),
          description: t("errors.sessionSave.description"),
          variant: "destructive",
        });
      }
    } finally {
      setIsHandlingSessionEnd(false);
    }
  }, [sessionStartTime, user, isHandlingSessionEnd, displayTranscriptions, t]);

  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout | undefined;
    let appearanceTimer: NodeJS.Timeout | undefined;

    if (connectionState === ConnectionState.Connected && !agent) {
      appearanceTimer = setTimeout(() => {
        disconnect();
        setHasSeenAgent(false);

        toast({
          title: t("errors.agentUnavailable.title"),
          description: t("errors.agentUnavailable.description"),
          variant: "destructive",
        });
      }, 5000);
    }

    if (agent) {
      setHasSeenAgent(true);
    }

    if (
      connectionState === ConnectionState.Connected &&
      !agent &&
      hasSeenAgent
    ) {
      disconnectTimer = setTimeout(() => {
        if (!agent) {
          disconnect();
          setHasSeenAgent(false);
        }

        toast({
          title: t("errors.agentDisconnected.title"),
          description: t("errors.agentDisconnected.description"),
          variant: "destructive",
        });
      }, 5000);
    }

    setIsChatRunning(
      connectionState === ConnectionState.Connected && hasSeenAgent,
    );

    if (connectionState === ConnectionState.Connected && !sessionStartTime) {
      setSessionStartTime(new Date());
    }

    if (connectionState !== ConnectionState.Connected && sessionStartTime) {
      handleSessionEnd();
    }

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (appearanceTimer) clearTimeout(appearanceTimer);
    };
  }, [connectionState, agent, disconnect, hasSeenAgent, t, handleSessionEnd, sessionStartTime]);

  const renderVisualizer = () => (
    <div className="flex w-full items-center">
      <div className="h-[320px] mt-16 md:mt-0 lg:pb-24 w-full">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="w-full h-full"
        />
      </div>
    </div>
  );

  const renderConnectionControl = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={isChatRunning ? "session-controls" : "connect-button"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
      >
        {isChatRunning ? (
          <SessionControls 
            onDisconnect={async () => {
              await handleSessionEnd();
              disconnect();
            }} 
          />
        ) : (
          <ConnectButton />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const handleToggleEdit = () => {
    setIsEditingInstructions(!isEditingInstructions);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 lg:p-4">
      <ChatControls 
        showEditButton={isChatRunning}
        isEditingInstructions={isEditingInstructions}
        onToggleEdit={handleToggleEdit}
      />
      <div className="flex flex-col flex-grow items-center justify-center">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-center w-full">
            <div className="lg:hidden w-full">
              {isChatRunning && renderVisualizer()}
            </div>
          </div>
          <div className="grow h-full flex items-center justify-center">
            <div className="w-full hidden lg:block">
              {isChatRunning && renderVisualizer()}
            </div>
          </div>
        </div>

        <div className="absolute-center">
          {renderConnectionControl()}
        </div>
      </div>
    </div>
  );
}
